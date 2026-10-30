import React from "react";
import { Navigate } from "react-router";

const GroupsList = () => {
  return <Navigate to="/community?tab=groups" replace />;
};

export default GroupsList;
