import { api as axios } from "boot/axios";
import { useQuasar } from "quasar";

export default function useUtil () {
  const { loading, notify, loadingBar } = useQuasar();

  return {
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
    api (options, showLoading = false) {
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
  }
}
