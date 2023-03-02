import { api as axios } from "boot/axios";
import { useQuasar } from "quasar";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

export default function useUtil () {
  const { loading, notify, loadingBar } = useQuasar();

  return {
    sendNotification ({ title, body }) {
      Notification.requestPermission().then((permission) => {
        if (permission != "granted")
          notify({
            message: "Permission to send notification is denied",
          });
        else {
          const notification = new Notification(
            title,
            {
              body,
            }
          );

          notification.addEventListener("click", (e) => {
            notification.close();
          });
        }
      });
    },
    pickBy (data) {
      const temp = {}
      for (const property in data) {
        if (data[property] !== undefined && data[property] !== '') {
          if (Array.isArray(data[property])) {
            if (data[property].length > 0)
              temp[property] = data[property]
          } else
            temp[property] = data[property]
        }
      }
      return temp
    },
    buildForm: (data) => {
      const keys = Object.keys(data);
      const formData = new FormData();
      keys.forEach((key) => {
        if (data[key] != undefined && !Array.isArray(data[key]))
          formData.append(key, data[key]);
        else if (Array.isArray(data[key])) {
          data[key].forEach((e, index) => {
            formData.append(`${key}[${index}]`, e);
          });
        }
      });
      return formData;
    },
    api: (options, showLoading = false) => {
      if (showLoading) loading.show()
      else loadingBar.start()
      return new Promise((resolve, reject) => {
        axios(options)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            notify({
              message: error.message,
              type: 'negative'
            })
            notify({
              message: error?.response?.data?.message,
              type: 'negative'
            })
            reject(error)
          })
          .finally(() => {
            if (showLoading)
              loading.hide()
            else loadingBar.stop()
          })
      })
    },
    vhPage: (offset, height) => ({
      height: height - offset + "px",
    }),
    initSocket: () => {
      const key = process.env.PUSHER_KEY;
      const cluster = process.env.PUSHER_CLUSTER
      if (!key || !cluster) return;
      window.Pusher = Pusher;
      window.Echo = new Echo({
        broadcaster: "pusher",
        // key: "6125e7ffbd1a07479efd",
        key,
        // cluster: "ap1",
        cluster,
        forceTLS: true,
        authorizer: (channel) => {
          return {
            authorize: (socketId, callback) => {
              axios({
                method: "POST",
                url: "broadcasting/auth",
                data: {
                  socket_id: socketId,
                  channel_name: channel.name
                }
              })
                .then((response) => {
                  callback(null, response.data);
                })
                .catch((error) => {
                  callback(error);
                });
            },
          };
        },
      });
    }
  }
}
