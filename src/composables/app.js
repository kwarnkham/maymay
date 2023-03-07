import { useQuasar } from "quasar";
import { useUserStore } from "src/stores/user-store";
import { inject } from "vue";
import { useRouter } from "vue-router";
import useUtil from "./util";

export default function useApp () {
  const bus = inject('bus')
  const userStore = useUserStore()
  const { sendNotification } = useUtil()
  const { notify } = useQuasar()
  const router = useRouter()
  const handleVisitEvent = ({ visit }) => {
    let title, body, message
    switch (visit.status) {
      case 1:
        bus.emit("visitCreated", visit);
        title = 'New visit #' + visit.id;
        body = "Please add products and service";
        message = "Please add products and service to the visit #" + visit.id
        break;
      case 2:
        bus.emit("productAddedToVisit", visit);
        title = 'Visit Confirmed #' + visit.id;
        body = "You may checkout the visit";
        message = `Products have been confirmed for the visit #${visit.id}. You may checkout the visit`
        break;
      case 3:
        bus.emit("visitConfirmed", visit);
        title = 'Products added#' + visit.id;
        body = "Please check and pack the products";
        message = "Please check and pack the products for visit #" + visit.id
        break;
      case 4:
        break;
      default:
        break
    }
    sendNotification({ title, body })
    notify({
      message,
      type: 'info',
      position: 'center',
      closeBtn: true,
      timeout: 0,
      actions: [
        {
          label: 'Go',
          color: 'primary',
          handler: () => {
            router.push({
              name: 'visit-details',
              params: {
                visit: visit.id
              }
            })
          }
        }
      ]
    })
  }
  return {
    subscribeToServer () {
      if (!window.Echo || !userStore.getUser) return;
      const channel = Echo.private('visit')
      userStore.getUser.roles.forEach((role) => {
        if (role.name == "cashier") {
          channel.listen("VisitCreated", handleVisitEvent);
          channel.listen("VisitConfirmed", handleVisitEvent);
        }

        else if (role.name == 'pharmacist') {
          channel.listen("ProductAddedToVisit", handleVisitEvent);
        }
      });
      channel.listen("VisitCompleted", ({ visit }) => {
        bus.emit("visitCompleted", visit)
      })
      channel.listen("VisitCanceled", ({ visit }) => {
        bus.emit("visitCanceled", visit)
      })
    },
    visitStatusToString (status) {
      switch (status) {
        case 1:
          return 'Pending';

        case 2:
          return 'Producted Added';

        case 3:
          return 'Confirmed';

        case 4:
          return 'Completed';

        case 5:
          return 'Canceled';
      }
    }
  }
}
