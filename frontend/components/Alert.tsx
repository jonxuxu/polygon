import { CheckCircleIcon } from "@heroicons/react/solid";

const Alert = ({ success, message }) => (
  <div
    className={`rounded-md ${
      success ? "bg-green-50" : "bg-yellow-50"
    } p-4 my-4`}
  >
    <div className="flex">
      <div className="flex-shrink-0">
        {success && (
          <CheckCircleIcon
            className="h-5 w-5 text-green-400"
            aria-hidden="true"
          />
        )}
      </div>
      <div className="ml-3">
        <h3
          className={`text-sm font-medium text-${
            success ? "green" : "yellow"
          }-800`}
        >
          {message}
        </h3>
      </div>
    </div>
  </div>
);

export default Alert;
