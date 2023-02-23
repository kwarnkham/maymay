import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import useUtil from "./util";

export default function usePagination (url) {
  const route = useRoute();
  const router = useRouter();
  const pagination = ref(null);
  const total = ref(0)
  const current = ref(Number(route.query.page ?? 1) ?? 1);
  const { api } = useUtil()
  const max = computed(
    () => Math.ceil(pagination.value?.total / pagination.value?.per_page) || 1
  );

  const fetcher = (params) => {
    if (!params.per_page) params.per_page = 30;
    return new Promise((resolve, reject) => {
      api({
        method: "GET",
        url,
        params,
      }).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      });
    })
  };

  const fetchMore = () => {
    const query = JSON.parse(JSON.stringify(route.query))
    fetcher(query).then((response) => {
      pagination.value = response.data.data;
      total.value = response.data.total

      const el = document.getElementsByClassName('q-list overflow-auto');
      if (el) {
        el[0]?.children[0]?.scrollIntoView()
      }
    });
  };

  onMounted(() => {
    let query = JSON.parse(JSON.stringify(route.query))
    fetcher(query).then((response) => {
      pagination.value = response.data.data;
      current.value = response.data.data.current_page;
      total.value = response.data.total
    });
  })

  watch(current, () => {
    router
      .replace({
        name: route.name,
        query: { ...route.query, page: current.value },
      })
      .then(fetchMore);
  });

  return {
    pagination,
    max,
    current,
    total,
  }
}
