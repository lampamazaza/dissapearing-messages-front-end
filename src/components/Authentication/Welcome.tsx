import baton from "@/services/baton";

export function Welcome({
  toAuth,
  toCreateAccount,
}: {
  toAuth: () => void;
  toCreateAccount: () => void;
}) {
  return (
    <div class="bg-chat flex flex-col justify-center items-center w-screen	 h-screen p-8">
      <div class="flex flex-col w-full max-w-[400px]  justify-center  p-6 bg-white rounded-lg border border-gray-200 shadow-md  dark:bg-gray-800 dark:border-gray-700">
        <div class="text-center text-[100px] select-none">🧙‍♂️</div>
        <span class="text-[20px] whitespace-nowrap text-center leading-5 font-bold">
          Welcome, kind Sir!
        </span>
        <div class="flex flex-col mt-4 gap-2">
          <button
            onClick={toCreateAccount}
            class="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create account
          </button>
          <button
            type="button"
            onClick={toAuth}
            class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-500 focus:outline-none bg-white rounded-lg  hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Authenticate
          </button>
        </div>
      </div>
    </div>
  );
}
