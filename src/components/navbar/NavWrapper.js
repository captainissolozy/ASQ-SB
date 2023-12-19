import styled from "styled-components";

const NavWrapper = styled.div` 
  @media (min-width: 768px) { 
    .navbar-expand-md .navbar-collapse { height: auto !important; }
  }
  .navbar{
    background: #302e38;
    position: sticky;
  }
  .lmh{
    max-width: 1400px;
  }
  .navbar-brand {
    margin-right: 0;
  }
  .navbar-nav {
    margin: 0 auto;
  }
  .btn-logout .MuiButtonBase-root {
    padding-top: 8px;
    border: 1px solid #fff;
    color: #fff;
  }
  .btn-logout .MuiButtonBase-root:hover {
    border-color: transparent;
    background-color: rgba(255,255,255, 0.5);
  }
  .nav-link .MuiButtonBase-root {
    color: #fff!important;
    position: relative;
    padding-top: 3px!important;
  }
  .nav-link .MuiButtonBase-root:after {
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    width: 0%;
    height: 1px;
    background-color: #fff;
  }
  .nav-link .MuiButtonBase-root:hover {
    background-color: transparent;
  }
  .nav-link .MuiButtonBase-root:hover:after {
    -webkit-transition: width 0.5s ease-in-out;
    -moz-transition: width 0.5s ease-in-out;
    -o-transition: width 0.5s ease-in-out;
    transition: width 0.5s ease-in-out;
    width: 100%;
  }
.btn-res{
  @media screen and (max-width: 769px){
    display: none!important;
    
  }
}
  .collapsible .content {
    padding: 6px;
    background-color: #eeeeee;
    @media screen and (min-width: 769px){
      display: none;
    }
  }
  .btn-no{
    cursor: pointer;
    @media screen and (min-width: 769px){
      display: none;
    }
  }
  .hidden{
    display: none;
    @media screen and (max-width: 769px){
      display: block;
    }
  }
`
export default NavWrapper