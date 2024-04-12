import React, { createContext, useMemo, useState, useContext } from "react";
import noop from "lodash/noop";

type MenuIds = "first" | "second" | "last";
type Menu = { id?: MenuIds; title?: string };

//  тип MenuSelected
type MenuSelected = {
  selectedMenu:Menu
}

//  тип SelectedMenu
type SelectedMenu = {
  id: MenuIds
}

//  тип MenuAction
type MenuAction = {
  onSelectedMenu: (obj: SelectedMenu) => void;
}

const MenuSelectedContext = createContext<MenuSelected>({
  selectedMenu: {} as SelectedMenu,
});

const MenuActionContext = createContext<MenuAction>({
  onSelectedMenu: noop,
});

type PropsProvider = {
  children: React.ReactElement; // тип для children
};

function MenuProvider({ children }: PropsProvider) {
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>({} as SelectedMenu);

  const menuContextAction = useMemo(
    () => ({
      onSelectedMenu: setSelectedMenu,
    }),
    []
  );

  const menuContextSelected = useMemo(
    () => ({
      selectedMenu,
    }),
    [selectedMenu]
  );

  return (
    <MenuActionContext.Provider value={menuContextAction}>
      <MenuSelectedContext.Provider value={menuContextSelected}>
        {children}
      </MenuSelectedContext.Provider>
    </MenuActionContext.Provider>
  );
}

type PropsMenu = {
  menus: Menu[]; // Додайте вірний тип для меню
};

function MenuComponent({ menus }: PropsMenu) {
  const { onSelectedMenu } = useContext(MenuActionContext);
  const { selectedMenu } = useContext(MenuSelectedContext);

  return (
    <>
      {menus.map((menu) => (
        <div key={menu.id} onClick={() => menu.id && onSelectedMenu({ id: menu.id })}>
          {menu.title}{" "}
          {menu.id && selectedMenu.id === menu.id ? "Selected" : "Not selected"}
        </div>
      ))}
    </>
  );
}

export function ComponentApp() {
  const menus: Menu[] = [
    {
      id: "first",
      title: "first",
    },
    {
      id: "second",
      title: "second",
    },
    {
      id: "last",
      title: "last",
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
}
