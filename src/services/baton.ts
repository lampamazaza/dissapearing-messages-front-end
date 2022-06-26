function success(message: string) {
  alert(message);
}

function error(message: string) {
  alert(message);
}

const baton = {
  success,
  error,
};

export default baton;
