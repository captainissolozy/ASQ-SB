import styled from "styled-components";

const LobbyWrapper = styled.div`
  .container{
    min-height: 1080px;
    max-width: 900px !important;
    background: white;
    border-radius: 12px;
  }
  .text-s{
    font-size: 16px;
  }
.t-tab{
    height: calc(75vh - 62.5px);
    border-bottom: black;
}
.sty-addbtn {
  background-color: #302e38;
  color: #fff;
}
.t-stick{
    position: sticky; top: 0;
    border-top: white;
    overflow: hidden;
}
.Mui-focused {
  border-color: #302e38;
}
.table{
  border-bottom: solid black 2px;
  overflow-x: scroll;
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
  .tableContainer {
    overflow: hidden;
    min-width: 360px;
  }
  .table-responsive {
    border-radius: 6px;
    overflow: hidden;
  }
  #dtHorizontalExample{
    overflow-x: hidden;
  }
  .css-2rshpx-MuiButtonBase-root-MuiIconButton-root:hover {
    background-color: rgba(48, 46, 56, 0.8);
  }
`
export default LobbyWrapper