import styled from "styled-components";

const CustomerWrapper = styled.div`
  .wrapper-box{
   
  }
  .t-height{
    max-height: 190px;
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
    overflow: scroll;
  }
  .box{
    border: solid black 2px;
  }

`
export default CustomerWrapper