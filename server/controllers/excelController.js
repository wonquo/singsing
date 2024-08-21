const commonController = require("./commonController");
const salesModel = require("../models/sales");
const purchaseModel = require("../models/purchase");

async function uploadExcel(req, res) {
  const excelData = req.body.data;
  const key1 = req.body.key1;
  const key2 = req.body.key2;

  /********************/
  /* Sales 엑셀 업로드 */
  /********************/
  if (key1 === "sales") {
    for (let i = 0; i < excelData.length; i++) {
      const params = excelData[i];
      let row = i + 1;

      if (!params.sales_date) {
        return res.status(400).json({
          message: row + "번째 데이터의 판매일자가 존재하지 않습니다.",
        });
      } else {
        //sales_date 가 YYYY-MM 형식인지 확인
        const date = params.sales_date;
        if (typeof date !== "string") {
          return res.status(400).json({
            message:
              row +
              "번째 데이터의 판매일자가 문자열이 아닙니다. 텍스트로 입력해주세요.",
          });
        }
        const dateArr = date.split("-");
        if (dateArr.length !== 2) {
          return res.status(400).json({
            message: row + "번째 데이터의 판매일자가 YYYY-MM 형식이 아닙니다.",
          });
        }
        if (dateArr[0].length !== 4 || dateArr[1].length !== 2) {
          return res.status(400).json({
            message: row + "번째 데이터의 판매일자가 YYYY-MM 형식이 아닙니다.",
          });
        }
        if (isNaN(dateArr[0]) || isNaN(dateArr[1])) {
          return res.status(400).json({
            message: row + "번째 데이터의 판매일자가 YYYY-MM 형식이 아닙니다.",
          });
        }
      }
      //날짜가 유효한지 확인
      const dateObj = new Date(params.sales_date);
      if (dateObj.toString() === "Invalid Date") {
        return res.status(400).json({
          message: row + "번째 데이터의 판매일자가 유효하지 않습니다.",
        });
      }

      if (params.business_name) {
        const business_id = await commonController.getBusinessId(params);

        if (!business_id) {
          return res.status(404).json({
            message:
              row +
              `번째 데이터의 사업자` +
              "(" +
              params.business_name +
              ")" +
              `가 존재하지 않습니다. \n등록된 사업자를 입력해주세요`,
          });
        } else {
          params.business_id = business_id;
        }
      } else {
        return res.status(400).json({
          message: row + "번째 데이터의 사업자가 존재하지 않습니다.",
        });
      }

      if (params.vendor_name) {
        const vendor_id = await commonController.getVendorId(params);
        if (!vendor_id) {
          return res.status(404).json({
            message:
              row +
              `번째 데이터의 거래처` +
              "(" +
              params.vendor_name +
              ")" +
              `가 존재하지 않습니다. \n등록된 거래처를 입력해주세요`,
          });
        } else {
          params.vendor_id = vendor_id;
        }
      } else {
        return res.status(400).json({
          message: row + "번째 데이터의 거래처가 존재하지 않습니다.",
        });
      }

      if (params.product_name) {
        const product_id = await commonController.getProductId(params);
        if (!product_id) {
          return res.status(404).json({
            message: `제품이 존재하지 않습니다. \n사업자에 등록된 제품을 입력해주세요`,
          });
        } else {
          params.product_id = product_id;
        }
      }

      if (params.payment_name || params.tax) {
        const payment_id = await commonController.getPaymentId(params);
        const payment_desc =
          params.vendor_name + "-" + params.tax + "-" + params.payment_name;
        if (!payment_id) {
          return res.status(404).json({
            message:
              row +
              `번째 데이터의 결제수단` +
              "(" +
              payment_desc +
              ")" +
              `가 존재하지 않습니다. \n등록된 결제수단을 입력해주세요`,
          });
        } else {
          params.payment_id = payment_id;
        }
      } else {
        return res.status(400).json({
          message: row + "번째 데이터의 결제수단이 존재하지 않습니다.",
        });
      }

      //unit_price, qty, total_sales 가 숫자인지 확인
      if (params.unit_price || params.unit_price === 0) {
        if (isNaN(params.unit_price)) {
          return res.status(400).json({
            message: row + "번째 데이터의 단가는 숫자로 입력해주세요.",
          });
        }
      }
      if (params.qty || params.qty === 0) {
        if (isNaN(params.qty)) {
          return res.status(400).json({
            message: row + "번째 데이터의 수량은 숫자로 입력해주세요.",
          });
        }
      }

      //if (params.total_sales) {
      //0으로 입력된 값은 허용
      if (params.total_sales || params.total_sales === 0) {
        if (isNaN(params.total_sales)) {
          return res.status(400).json({
            message: row + "번째 데이터의 총액은 숫자로 입력해주세요.",
          });
        }
      } else {
        return res.status(400).json({
          message: row + "번째 데이터의 매출액이 존재하지 않습니다.",
        });
      }

      excelData[i] = params;
    }

    for (let i = 0; i < excelData.length; i++) {
      salesModel.createSales(excelData[i], (error, sales_id) => {
        if (error) {
          if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "중복된 데이터 입니다." });
          } else {
            return res
              .status(500)
              .json({ message: "데이터 생성에 실패했습니다." });
          }
        }
      });
    }

    return res.json({ message: "엑셀 업로드에 성공했습니다." });

    /************************/
    /* Purchase 엑셀 업로드 */
    /***********************/
  } else if (key1 === "purchase") {
    for (let i = 0; i < excelData.length; i++) {
      const params = excelData[i];

      let row = i + 1;

      //key2 : business_id
      params.business_id = key2;

      console.log(params);

      const requiredFields = [
        { issue_date: "작성일자" },
        { vendor_name: "거래처" },
        { proof_name: "증빙" },
        { useage_name: "용도" },
        { total_amount: "총액" },
      ];

      for (let j = 0; j < requiredFields.length; j++) {
        const key = Object.keys(requiredFields[j])[0];
        const value = requiredFields[j][key];
        if (params[key] === null || params[key] === undefined) {
          return res.status(400).json({
            message:
              row + "번째 데이터의 [" + value + "] 이(가) 존재하지 않습니다.",
          });
        }
      }
      //issue_date 를 10자리로 자르기
      params.issue_date = params.issue_date.substring(0, 10);

      //issue_date 가 YYYY-MM-DD 형식인지 확인
      const date = params.issue_date;
      if (typeof date !== "string") {
        return res.status(400).json({
          message:
            row +
            "번째 데이터의 작성일자가 문자열이 아닙니다. 텍스트 형식으로 입력해주세요.",
        });
      }
      const dateArr = date.split("-");
      if (dateArr.length !== 3) {
        return res.status(400).json({
          message: row + "번째 데이터의 작성일자가 YYYY-MM-DD 형식이 아닙니다.",
        });
      }
      if (
        dateArr[0].length !== 4 ||
        dateArr[1].length !== 2 ||
        dateArr[2].length !== 2
      ) {
        return res.status(400).json({
          message: row + "번째 데이터의 작성일자가 YYYY-MM-DD 형식이 아닙니다.",
        });
      }
      if (isNaN(dateArr[0]) || isNaN(dateArr[1]) || isNaN(dateArr[2])) {
        return res.status(400).json({
          message: row + "번째 데이터의 작성일자가 YYYY-MM-DD 형식이 아닙니다.",
        });
      }
      //날짜가 유효한지 확인
      const dateObj = new Date(date);
      if (dateObj.toString() === "Invalid Date") {
        return res.status(400).json({
          message: row + "번째 데이터의 작성일자가 유효하지 않습니다.",
        });
      }
      /* vendor_id -> Key-IN 으로 변경함으로써 주석처리
      const vendor_id = await commonController.getVendorId(params);

      if (!vendor_id) {
        return res.status(404).json({
          message:
            row +
            `번째 데이터의 거래처` +
            "(" +
            params.vendor_name +
            ")" +
            `가 존재하지 않습니다. \n등록된 거래처를 입력해주세요`,
        });
      } else {
        params.vendor_id = vendor_id;
      }
      */
      let codeParams = {
        master_code: "PURCHASE_PROOF",
        detail_name: params.proof_name,
      };

      const proof = await commonController.getDetailCode(codeParams);

      if (!proof) {
        return res.status(404).json({
          message:
            row +
            `번째 데이터의 증빙` +
            "(" +
            params.proof_name +
            ")" +
            `가 존재하지 않습니다. \n등록된 증빙을 입력해주세요`,
        });
      }

      params.proof = proof;

      codeParams = {
        master_code: "PURCHASE_USEAGE",
        detail_name: params.useage_name,
      };

      const useage = await commonController.getDetailCode(codeParams);

      if (!useage) {
        return res.status(404).json({
          message:
            row +
            `번째 데이터의 용도` +
            "(" +
            params.useage_name +
            ")" +
            `가 존재하지 않습니다. \n등록된 용도를 입력해주세요`,
        });
      }

      params.useage = useage;

      //total_amount 가 숫자인지 확인
      if (isNaN(params.total_amount)) {
        return res.status(400).json({
          message: row + "번째 데이터의 총액은 숫자로 입력해주세요.",
        });
      }

      excelData[i] = params;
    }

    for (let i = 0; i < excelData.length; i++) {
      purchaseModel.createPurchase(excelData[i], (error, purchase_id) => {
        if (error) {
          if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "중복된 데이터 입니다." });
          } else {
            return res
              .status(500)
              .json({ message: "데이터 생성에 실패했습니다." });
          }
        }
      });
    }

    return res.json({ message: "엑셀 업로드에 성공했습니다." });
  }

  res.json({ message: "uploadExcel" });
}

module.exports = {
  uploadExcel,
};
