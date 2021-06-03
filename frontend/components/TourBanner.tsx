import Link from "next/link";
import { XIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";

export function TourBanner() {
  const [tourComplete, setTourComplete] = useState(true);
  const TOUR_COMPLETE_KEY = "tour-complete";
  useEffect(() => {
    setTourComplete(!!window.localStorage.getItem(TOUR_COMPLETE_KEY));
  }, []);

  const completeTour = () => {
    window.localStorage.setItem(TOUR_COMPLETE_KEY, "true");
    setTourComplete(true);
  };

  if (tourComplete) return false;

  return (
    <div className="relative bg-primary-600">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:text-center sm:px-16">
          <p className="font-medium text-white">
            <span className="md:hidden">First time here?</span>
            <span className="hidden md:inline">
              Welcome to Polygon! First time here?
            </span>
            <span className="block sm:ml-2 sm:inline-block">
              <Link href="/?tour=true">
                <a
                  className="text-white font-bold underline"
                  onClick={completeTour}
                >
                  Take a Tour <span aria-hidden="true">&rarr;</span>
                </a>
              </Link>
            </span>
          </p>
        </div>
        <div className="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start">
          <button
            type="button"
            className="flex p-2 rounded-md hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={completeTour}
          >
            <span className="sr-only">Dismiss</span>
            <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
