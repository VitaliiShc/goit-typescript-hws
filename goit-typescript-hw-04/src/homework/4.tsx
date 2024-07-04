import { createContext, useMemo, useState, useContext, ReactNode } from 'react';
import noop from 'lodash/noop';

type MenuIds = 'first' | 'second' | 'last';
type Menu = { id: MenuIds; title: string };
type SelectedMenu = { id: MenuIds };
// Додати тип Menu Selected
interface IMenuSelected {
  selectedMenu: { id: MenuIds };
}
// Додайте тип MenuAction
interface IMenuAction {
  onSelectedMenu: (arg: SelectedMenu) => void;
}
// Додати тип для children
interface IPropsProvider {
  children: ReactNode;
}

const MenuActionContext = createContext<IMenuAction>({
  onSelectedMenu: noop,
});

const MenuSelectedContext = createContext<IMenuSelected>({
  selectedMenu: { id: 'first' },
});

function MenuProvider({ children }: IPropsProvider) {
  // Додати тип для SelectedMenu він повинен містити { id }
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>({
    id: 'first',
  });

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
        <div key={menu.id} onClick={() => onSelectedMenu({ id: menu.id })}>
          {menu.title}{' '}
          {selectedMenu.id === menu.id ? 'Selected' : 'Not selected'}
        </div>
      ))}
    </>
  );
}

export function ComponentApp() {
  const menus: Menu[] = [
    {
      id: 'first',
      title: 'first',
    },
    {
      id: 'second',
      title: 'second',
    },
    {
      id: 'last',
      title: 'last',
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
}
