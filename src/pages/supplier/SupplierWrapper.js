import styled from "styled-components";

const LobbyWrapper = styled.div`
  .wrapper-box {
    border-radius: 12px;
    overflow: hidden;
  }
  .t-tab{
    height: calc(75vh - 62.5px);
    border-bottom: black;
  }

  .t-stick{
    position: sticky; top: 0;
    border-top: white;
    overflow: hidden;
  }
  .table{
    border-bottom: solid black 2px;
    overflow: hidden;
  }
  .box{
    border: solid black 2px;
  }
  table thead tr th {
    font-size: 16px;
  }
  table tbody tr td {
    font-size: 14px;
  }
  th{
    background: #302e38;
  }
  th{
   // background: #23354D;
  }
  .container{
    min-height: 1080px;
    max-width: 900px !important;
    background: white;
  }
  .sty-addbtn {
    background-color: #302e38;
    color: #fff;
  }
  .header-wrapper {
    width: 100%;
  }
  .wrap-input {
    gap: 16px;
  }
  .css-2rshpx-MuiButtonBase-root-MuiIconButton-root:hover {
    background-color: rgba(48, 46, 56, 0.8);
  }
`
export default LobbyWrapper