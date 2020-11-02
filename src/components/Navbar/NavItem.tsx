import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  to: string,
  title: string
}

const NavItem: FC<Props> = ({to, title}) => {

  let location = useLocation();

  const OnClick = () => {

    (document.getElementById("navbar-toggle") as HTMLInputElement).checked = false;
    
  }

  const currentMainPath = "/" + location.pathname.split("/")[1];

  return (<li className={"nav-item " + ((currentMainPath === to) ? 'active' : '')}><Link onClick={OnClick} to={to} className="nav-link" >{title}</Link></li>);
}

export default NavItem;