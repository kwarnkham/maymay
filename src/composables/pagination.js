import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import useUtil from "./util";

export default function usePagination (url, params) {
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
    if (!params?.per_page) params.per_page = 30;
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

  const fetch = (query) => {
    fetcher(query).then((response) => {
      pagination.value = response.data.data;
      current.value = response.data.data.current_page;
      total.value = response.data.total
    });
  }

  onMounted(() => {
    let query = JSON.parse(JSON.stringify(route.query))
    if (params) query = { ...query, ...params }
    router.replace({
      name: route.name,
      query: query
    })
    fetch(query)
  })

  watch(current, () => {
    router
      .replace({
        name: route.name,
        query: { ...route.query, page: current.value },
      })
      .then(fetchMore);
  });

  const updateQueryAndFetch = (newQuery) => {
    const options = {
      name: route.name,
      query: JSON.parse(JSON.stringify(route.query)),
    };
    options.query = { ...options.query, ...newQuery };
    router.replace(options).then(() => {
      if (current.value == 1) fetch(options.query);
      else current.value = 1;
    });
  };

  return {
    pagination,
    max,
    current,
    total,
    fetch,
    updateQueryAndFetch
  }
}
