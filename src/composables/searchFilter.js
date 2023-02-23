import { debounce } from "quasar";
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router";

export default function useSearchFilter (pagination) {
  const route = useRoute();
  const router = useRouter()
  const search = ref(route.query.search ?? "");
  watch(
    search,
    debounce(() => {
      const options = {
        name: route.name,
        query: {},
      };
      if (search.value) options.query.search = search.value;
      if (pagination.params) options.query = { ...pagination.params, ...options.query }
      router.replace(options).then(() => {
        if (pagination.current.value == 1) pagination.fetch(options.query);
        else pagination.current.value = 1;
      });
    }, 800)
  );
  return {
    search,
  }
}
