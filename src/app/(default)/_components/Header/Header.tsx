import { cookies } from "next/headers";
import { getImageProps } from "next/image";
import Link from "next/link";

import { Box, Flex } from "@mantine/core";

import Hamburger from "../Hamburger/Hamburger";
import ProfileSelector from "../ProfileSelector/ProfileSelector";
import SubMenu from "../SubMenu";

import classes from "./Header.module.css";

export default function Header() {
  const cookieStore = cookies();
  const profileListCookie = cookieStore.get("scorew_profile_list");
  const profileList = profileListCookie?.value
    ? JSON.parse(profileListCookie?.value)
    : [];
  const currentProfileCookie = cookieStore.get("scorew_current_profile");
  const currentProfile = currentProfileCookie?.value || "score_watcher";

  const common = { alt: "Art Direction Example", sizes: "100vw" };
  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...common,
    width: 537,
    height: 176,
    quality: 100,
    src: "/logo_white2.png",
  });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    width: 694,
    height: 98,
    quality: 100,
    src: "/logo_white.png",
  });

  return (
    <Box component="header" className={classes.header}>
      <Flex className={classes.header_inner}>
        <Flex component={Link} className={classes.header_link} href="/">
          <picture className={classes.header_logo}>
            <source media="(min-width:62em)" srcSet={desktop} />
            <source media="(max-width:62em)" srcSet={mobile} />
            <img
              {...rest}
              alt="Score Watcherのロゴ。三日月の中央に円が配置されたモノカラー"
            />
          </picture>
        </Flex>
        <Box hiddenFrom="md">
          <Hamburger>
            <SubMenu />
          </Hamburger>
        </Box>
        <Flex hidden visibleFrom="md" className={classes.header_menu_desktop}>
          <SubMenu />
          <Flex direction="column" gap={4}>
            <ProfileSelector
              profileList={profileList}
              currentProfile={currentProfile}
            />
            <Flex className={classes.header_copyright}>
              <Box>
                ©{" "}
                <Link href="https://twitter.com/newt239" target="_blank">
                  newt239
                </Link>
              </Box>
              <Box>2022-2024</Box>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
