import baton from "@/services/baton";

export function AuthenticatePanel({
  authenticate,
  back,
}: {
  authenticate: (payload: { alias: string; password: string }) => Promise<void>;
  back: () => void;
}) {
  const onSubmit = async (event) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.target);
      await authenticate({
        alias: formData.get("alias") as string,
        password: formData.get("password") as string,
      });
    } catch (error) {
      baton.error("Failed to create account");
    }
  };

  return (
    <div class="flex flex-col justify-center items-center w-screen h-screen p-9">
      <form
        onSubmit={onSubmit}
        class="flex flex-col w-full max-w-[400px]  justify-center  p-6 bg-white rounded-lg border border-gray-200 shadow-md  dark:bg-gray-800 dark:border-gray-700"
      >
        <span class="text-20 whitespace-nowrap text-center font-bold">
          Authentication
        </span>
        <div class="flex flex-col mt-8 gap-8">
          <div>
            <label
              for="alias"
              class="block mb-2 text-xs font-medium text-gray-900 dark:text-gray-300"
            >
              Alias (used in links for sharing profile)
            </label>
            <input
              type="text"
              id="alias"
              name="alias"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              for="password"
              class="block mb-2 text-xs font-medium text-gray-900 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            class="mt-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Authenticate
          </button>
          <button
            type="button"
            onClick={back}
            class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-500 focus:outline-none bg-white rounded-lg  hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </form>
    </div>
  );
}
