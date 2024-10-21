import React from "react";
import { useUser } from "../../../../context/UserProvider";

export const AdNav = () => {
  const { userInfo } = useUser();

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 focus:outline-none">
        <img
          src={userInfo.profile_image}
          alt="User Avatar"
          className="w-8 h-8 rounded-full border-2 border-gray-300"
        />
        <span className="hidden lg:block text-white font-medium">
          {userInfo.username || "H2H Tech Energy"}
        </span>
      </div>
    </div>
  );
};
