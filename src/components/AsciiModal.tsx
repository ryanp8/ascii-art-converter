import React from "react";
import { Ascii } from "@/components/Ascii";
import { Transition, Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { useDispatch } from "react-redux";
import { setAuthOpen } from "@/redux/uiSlice";
import { UserContext } from "@/context/userContext";
import AuthModal from "./AuthModal";

interface Props {
  ascii: string;
}

export default function AsciiModal({ ascii }: Props) {
  const [isOpen, setIsOpen] = React.useState(true);
  const dispatch = useDispatch();
  const { user } = React.useContext(UserContext);
  const [showAuth, setShowAuth] = React.useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  const onUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) {
      dispatch(setAuthOpen(true));
      setShowAuth(true);
      return;
    }
    if (ascii) {
      // setLoading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({ ascii }),
      });
      // setLoading(false);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-1" onClose={() => {}}>
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
                <Dialog.Panel className="transform overflow-hidden p-6 rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between my-2">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Result
                    </Dialog.Title>
                    <XMarkIcon
                      className="block h-6 w-6 cursor-pointer"
                      aria-hidden="true"
                      onClick={closeModal}
                    />
                  </div>
                  <Ascii ascii={ascii} />
                  <button
                    onClick={onUpload}
                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 my-4 border border-blue-500 hover:border-transparent rounded"
                  >
                    Upload to gallery
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
