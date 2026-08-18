"use client";
import React, {useEffect, useState} from "react";
import "./settings.modules.scss";
import {useGetApi} from "@/hooks/settings/GetApi";
import {useGetMe} from "@/hooks/settings/GetMe";
import {useNotify} from "@/hooks/useNotify";
import {useRouter} from "next/navigation";
import NotFound from "../notfound/NotFound";
import {useTheme} from "next-themes";
import SettingsSkeleton from "./SettingsLoading";

const Settings = () => {
  const {data: apiData, isPending: apiPending, error: apiError} = useGetApi();
  const {data: meData, isPending: mePending, error: meError} = useGetMe();
  const {notice} = useNotify();
  const {theme, setTheme} = useTheme();
  const route = useRouter();
  useEffect(() => {
    if (apiError?.message) {
      notice({
        text: apiError?.message,
        status: "error",
        time: "infinite",
        close: "true",
      });
      route.refresh();
    }
  }, [apiError]);

  useEffect(() => {
    if (meError?.message) {
      notice({
        text: meError?.message,
        status: "error",
        time: "infinite",
        close: "true",
      });
      route.refresh();
    }
  }, [meError]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="settings container">
      {apiData &&
      meData &&
      !apiPending &&
      !mePending &&
      !apiError &&
      !meError ? (
        <>
          <h2 className="settings__title">Settings</h2>
          <div className="settings__bottom">
            <div className="settings__bottom-about">
              <p className="settings__status">{apiData?.message}</p>
              <span className="settings__boab">
                <p className="settings__boab-subtitle">{apiData?.data?.name}</p>
                <p className="settings__boab-ver">
                  version: {apiData?.data?.version}
                </p>
              </span>
            </div>
            <div className="settings__bottom-about">
              <h2 className="settings__bottom-title">{meData?.message}</h2>
              <p className="settings__boab-text">
                login: {meData?.data?.login}
              </p>
              <p className="settings__boab-text">
                fullname: {meData?.data?.fullName}
              </p>
            </div>
          </div>

          <div className="settings__bottom-look-wr">
            <h2 className="settings__bottom-title">Look</h2>
            <div className="settings__bottom-look">
              <div onClick={() => setTheme("light")} className={`settings__bottom-look-items settings__bottom-look-items-light ${theme == "light" ? "settings__bottom-look-items-active" : ""}`}></div>
              <div onClick={() => setTheme("dark")} className={`settings__bottom-look-items settings__bottom-look-items-dark ${theme == "dark" ? "settings__bottom-look-items-active" : ""}`}></div>
            </div>
          </div>
        </>
      ) : apiPending || mePending ? (
       <SettingsSkeleton/>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default Settings;
