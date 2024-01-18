import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import purse from "@/assets/free-icon-purse-1002782.png";
import purseSelected from "@/assets/free-icon-purse-1002833.png";
import history from "@/assets/free-icon-receipt-941058.png";
import historySelected from "@/assets/free-icon-receipt-941109.png";
import exchange from "@/assets/free-icon-won-4923090.png";
import exchangeSelected from "@/assets/free-icon-won-4923072.png";

const Layout = () => {
  // 로고가 들어갈 위치
  const Logo = styled.nav`
    margin: 3vw;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  `;

  // Main에는 Padding이 필요하지 않을까...?
  const Main = styled.main`
    padding: 1rem;
    margin-bottom: 10vh;
  `;

  // 하단바
  const Navbar = styled.nav`
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;

    background-color: lightblue;

    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 10vh;
  `;

  // 네비게이션바 이미지
  const Img = styled.img`
    width: 40px;
    margin-bottom: -5px;
  `;

  // NavLink의 스타일
  const NavButton = styled(NavLink)`
    display: flex;
    flex-direction: column;
    justify-content: center;

    // NavLink가 선택됐을 경우 active class가 추가 되는 것을 발견해서 작성해본 코드
    &.active {
      color: black;

      // 지갑 선택
      &.purse {
        img {
          content: url(${purseSelected});
        }
      }
      // 내역 선택
      &.history {
        img {
          content: url(${historySelected});
        }
      }
      // 환전 선택
      &.exchange {
        img {
          content: url(${exchangeSelected});
        }
      }
    }
  `;

  return (
    <>
      <Logo>⛩️ KonKon!!</Logo>
      <Main>
        <Outlet />
      </Main>
      <Navbar>
        <NavButton className="purse" to="/">
          <Img src={purse} />
          <div>지갑</div>
        </NavButton>
        <NavButton className="history" to="/history">
          <Img src={history} />
          <div>내역</div>
        </NavButton>
        <NavButton className="exchange" to="/exchange">
          <Img src={exchange} />
          <div>환전</div>
        </NavButton>
      </Navbar>
    </>
  );
};

export default Layout;
