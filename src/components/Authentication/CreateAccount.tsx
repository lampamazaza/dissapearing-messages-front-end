
export function CreateAccount({createUser}) {

  const onSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    await createUser({name: formData.get("name"), alias: formData.get("alias") })
  } 

  return (
    <div class="bg-chat flex flex-col justify-center items-center w-screen	 h-screen p-8">
      <form onSubmit={onSubmit} class="flex flex-col w-full max-w-[400px]  justify-center  p-6 bg-white rounded-lg border border-gray-200 shadow-md  dark:bg-gray-800 dark:border-gray-700">
        <span class="text-[20px] whitespace-nowrap text-center leading-5 font-bold">
          Create account
        </span>
        <div class="flex flex-col mt-4 gap-2">
          <div>
            <label
              for="name"
              class="text-gray-500 block mb-2 text-xs font-medium text-gray-900 dark:text-gray-300"
            >
              Name (as a nickname)
            </label>
            <input
              id="name"
              type="text"
              name="name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              for="alias"
              class="text-gray-500 block mb-2 text-xs font-medium text-gray-900 dark:text-gray-300"
            >
              Alias (will be used in links for sharing profile)
            </label>
            <input
            type="text"
              id="alias"
              name="alias"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            class="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
