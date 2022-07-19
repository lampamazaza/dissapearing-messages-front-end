export function Welcome({
  toAuth,
  toCreateAccount,
}: {
  toAuth: () => void;
  toCreateAccount: () => void;
}) {
  return (
    <div class="flex flex-col justify-center items-center w-screen	 h-screen p-9">
      <div class="flex flex-col w-full max-w-[400px]  justify-center  p-6 bg-white rounded-lg border border-gray-200 shadow-md">
        <div class="text-center text-[100px] select-none">🧙‍♂️</div>
        <span class="text-20 whitespace-nowrap text-center font-bold">
          Welcome, kind Sir!
        </span>
        <div class="flex flex-col mt-8 gap-8">
          <button
            onClick={toCreateAccount}
            class="mt-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Create account
          </button>
          <button
            type="button"
            onClick={toAuth}
            class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-500 focus:outline-none bg-white rounded-lg hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-200"
          >
            Authenticate
          </button>
        </div>
      </div>
    </div>
  );
}
