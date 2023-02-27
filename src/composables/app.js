import { useQuasar } from "quasar";

export default function useApp () {


  return {
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
