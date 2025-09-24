export const useTestStore = defineStore('test', () => {
  const params = ref({ skip: 0 })

  useFetch('/test/hello_post', {
    ...FetchOptsDefault,
    headers: { Cookie: `token=${useCookie('token').value}` },
    body: params,
  })

  return { params }
})

export const refsTestStore = () => storeToRefs(useTestStore())
