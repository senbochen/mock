export const mockExampleLoadMoreData = (
  params: Record<string, any>,
): Promise<any> => {
  return new Promise<Record<string, any>>((resolve) => {
    setTimeout(() => {
      const pageSize = params.pageSize
      const currentPage = params.currentPage
      const currentData: any[] = []
      for (let i = 1; i <= pageSize; i++) {
        const idx = (currentPage - 1) * pageSize + i
        const mockData = {
          id: idx,
          name: `第${idx}项`,
        }
        currentData.push(mockData)
      }
      console.log(`请求参数${JSON.stringify(params)}`)
      return resolve({
        data: {
          result: {
            items: currentData,
            pageCount: 3,
          },
        },
      })
    }, 800)
  })
}
