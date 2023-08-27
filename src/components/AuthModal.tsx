import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthOpen } from "@/redux/uiSlice";
import { RootState } from "@/redux/store";
import { Transition, Dialog } from "@headlessui/react";
import { UserContext } from "@/context/userContext";

export default function AuthModal() {
  const isOpen = useSelector((state: RootState) => state.ui.showAuthModal);
  const dispatch = useDispatch();
  const [showSignUp, setShowSignUp] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [invalidUsername, setInvalidUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const {setUser} = React.useContext(UserContext)

  function closeModal() {
    dispatch(setAuthOpen(false));
  }

  async function onSubmit() {
    if (showSignUp) {
      if (password === confirmPassword) {
        const res = await fetch("/api/signup", {
          method: "POST",
          body: JSON.stringify({
            username,
            password,
          }),
        });
        if (res.status == 401) {
          setInvalidUsername(username);
          setError("That username already exists.");
        } else {
          const user = await res.json();
          dispatch(setAuthOpen(false));
          setUser(user);
        }
      }
    } else {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
      });
      if (res.status == 401) {
        setError("Invalid username or password.");
      } else {
        const user = await res.json();
        dispatch(setAuthOpen(false));
        setUser(user);
      }
    }
  }

  return (
    <>
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {showSignUp ? "Sign Up" : "Login"}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please {showSignUp ? "sign up" : "log in"} to upload your
                      picture to the gallery.
                    </p>
                  </div>
                  <form className="bg-white rounded pt-2">
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm mb-2"
                        for="username"
                      >
                        Username
                      </label>
                      <input
                        className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        onChange={(e) => {
                          if (e.target.value === invalidUsername) {
                            setError("That username already exists");
                          } else {
                            setError("");
                          }
                          setUsername(e.target.value);
                        }}
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm mb-2"
                        for="password"
                      >
                        Password
                      </label>
                      <input
                        className="border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                      {showSignUp && (
                        <>
                          <label
                            className="block text-gray-700 text-sm mb-2"
                            for="confirm-password"
                          >
                            Confirm Password
                          </label>
                          <input
                            className="border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="confirm-password"
                            type="password"
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                            }}
                          />
                          {password !== confirmPassword && (
                            <p className="text-red-500 text-xs italic">
                              Passwords must match.
                            </p>
                          )}
                        </>
                      )}
                      {error && (
                        <p className="text-red-500 text-xs italic">{error}</p>
                      )}
                    </div>
                  </form>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={onSubmit}
                    >
                      {showSignUp ? "Sign up" : "Log in"}
                    </button>
                    <p className="mt-3 text-gray-600 text-xs font-medium">
                      <span
                        className="underline cursor-pointer"
                        onClick={() => setShowSignUp(!showSignUp)}
                      >
                        {showSignUp ? "Log in" : "Sign up"}
                      </span>{" "}
                      {showSignUp
                        ? "if you already have an account"
                        : "if you don't already have an account"}
                      .
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
