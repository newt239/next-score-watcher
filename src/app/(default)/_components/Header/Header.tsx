import { cookies } from "next/headers";
import { getImageProps } from "next/image";
import Link from "next/link";

import { Anchor, Box, Flex } from "@mantine/core";

import Hamburger from "../Hamburger/Hamburger";
import SelectProfile from "../SelectProfile/SelectProfile";
import SubMenu from "../SubMenu";

import classes from "./Header.module.css";

import { getUser } from "@/utils/auth/auth-helpers";

const Header = async () => {
  const cookieStore = await cookies();
  const profileListCookie = cookieStore.get("scorew_profile_list");
  const profileList = profileListCookie?.value ? JSON.parse(profileListCookie?.value) : [];
  const currentProfileCookie = cookieStore.get("scorew_current_profile");
  const currentProfile = currentProfileCookie?.value || "score_watcher";

  // Better Authユーザー取得
  const user = await getUser();

  const common = {
    alt: "Score Watcherのロゴ。モノカラーで、三日月の中央部に円が配置された形をしている。",
    sizes: "100vw",
  };
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
            <img {...rest} alt="Score Watcherのロゴ。三日月の中央に円が配置されたモノカラー" />
          </picture>
        </Flex>
        <Box hiddenFrom="md">
          <Hamburger>
            <SubMenu user={user} />
          </Hamburger>
        </Box>
        <Flex hidden visibleFrom="md" className={classes.header_menu_desktop}>
          <SubMenu user={user} />
          <Flex direction="column" gap={4}>
            <SelectProfile profileList={profileList} currentProfile={currentProfile} />
            <Flex className={classes.header_copyright}>
              <Box>
                ©{" "}
                <Anchor
                  component={Link}
                  c="white"
                  href="https://twitter.com/newt239"
                  target="_blank"
                >
                  newt239
                </Anchor>
              </Box>
              <Box>2022-2025</Box>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
