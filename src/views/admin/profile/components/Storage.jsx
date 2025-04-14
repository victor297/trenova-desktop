import React from "react";
import { BsCloudCheck } from "react-icons/bs";
import { useSelector } from "react-redux";
import Card from "@/components/card";
// import CardMenu from "@/components/card/CardMenu";

const Storage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const availableSpaceMB = userInfo.availableSpace; // Available space in MB
  const usedSpaceMB = Math.round(userInfo.usedSpace); // Used space in MB
  const usedPercentage = (usedSpaceMB / availableSpaceMB) * 100; // Calculate percentage

  return (
    <Card extra={"w-full h-full p-4"}>
      {/* <div className="ml-auto">
        <CardMenu />
      </div> */}
      {/* Your storage */}
      <div className="mb-auto flex flex-col items-center justify-center">
        <div className="mt-2 flex items-center justify-center rounded-full bg-lightPrimary p-[26px] text-5xl font-bold text-brand-500 dark:!bg-navy-700 dark:text-white">
          <BsCloudCheck />
        </div>
        <h4 className="text-2xl mb-px mt-3 font-bold text-navy-700 dark:text-white">
          Your storage
        </h4>
        <p className="text-base px-5 text-center font-normal text-gray-900 md:!px-0 xl:!px-8">
          Supervise your drive space in the easiest way
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col">
        <div className="flex justify-between">
          <p className="text-sm font-medium text-gray-900">
            {availableSpaceMB} MB
          </p>
          <p className="text-sm font-medium text-gray-900">{usedSpaceMB} MB</p>
        </div>
        <div className="mt-2 flex h-3 w-full items-center rounded-full bg-lightPrimary dark:!bg-navy-700">
          <div
            className="h-full rounded-full bg-brand-500 dark:!bg-white"
            style={{ width: `${usedPercentage}%` }} // Set width based on percentage
          />
        </div>
      </div>
    </Card>
  );
};

export default Storage;
