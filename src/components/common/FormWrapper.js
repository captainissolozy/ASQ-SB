import styled from "styled-components";

const FormWrapper = styled.div`
  .regis-b {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.05)!important;
    border: none!important;
  }
  .box {
    height: calc(100vh - 62.5px);
    z-index: -10;
  }
  .c-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 320px !important;
  }
  .font {
    font-size: 1.2em;
    position: absolute;
    top: 5px;
    left: -26px;
    font-size: 18px;
  }
  .vertical-center {
    margin: 0;
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  .pt-2 {
    width: 100%;
    max-width: 218px;
  }
  .mxw {
    max-width: 161px;
    align-items: center; 
  } 
  .wrap-btnsubmit button {
    min-width: 161px;
  }
  button.mx-3 {
    background-color: #302e38;
    color: #e2f3e5;
    margin: 0!important;
    padding: 10px 16px;
  }
`;
export default FormWrapper;
