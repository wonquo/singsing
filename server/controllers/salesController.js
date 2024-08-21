const salesModel = require("../models/sales");

//조회 핸들러
function getSales(req, res) {
  const params = {
    business_id: req.query.business_id,
    vendor_name: req.query.vendor_name,
    from_date: req.query.from_date,
    to_date: req.query.to_date,
  };

  salesModel.getSales(params, (error, sales) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(sales);
  });
}

//생성 핸들러
async function createSales(req, res) {
  const params = {};
  Object.entries(req.body).forEach(([key, value]) => {
    params[key] = value;
  });
  try {
    if (params.vendor_name) {
      const vendorId = await new Promise((resolve, reject) => {
        salesModel.checkVendorExists(params, (error, vendorId) => {
          if (error) {
            reject(error);
          } else {
            resolve(vendorId);
          }
        });
      });

      if (!vendorId) {
        return res.status(404).json({
          message: `거래처가 존재하지 않습니다. \n사업자에 등록된 거래처를 입력해주세요`,
        });
      } else {
        params.vendor_id = vendorId;
      }
    }

    if (params.product_name) {
      const productId = await new Promise((resolve, reject) => {
        salesModel.checkProductExists(params, (error, productId) => {
          if (error) {
            reject(error);
          } else {
            resolve(productId);
          }
        });
      });

      if (!productId) {
        return res.status(404).json({
          message: `제품이 존재하지 않습니다. \n사업자에 등록된 제품을 입력해주세요`,
        });
      } else {
        params.product_id = productId;
      }
    }

    if (params.payment_name) {
      const paymentId = await new Promise((resolve, reject) => {
        salesModel.checkPaymentExists(params, (error, paymentId) => {
          if (error) {
            reject(error);
          } else {
            resolve(paymentId);
          }
        });
      });

      if (!paymentId) {
        return res.status(404).json({
          message: `결제수단이 존재하지 않습니다. \n사업자에 등록된 결제수단을 입력해주세요`,
        });
      } else {
        params.payment_id = paymentId;
      }
    }

    salesModel.createSales(params, (error, sales_id) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "중복된 데이터 입니다." });
        } else {
          return res
            .status(500)
            .json({ message: "데이터 생성에 실패했습니다." });
        }
      }
      res.status(201).json({ sales_id: sales_id });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred." });
  }
}

//거래처 정보 업데이트 핸들러
async function updateSales(req, res) {
  const params = {};
  Object.entries(req.body).forEach(([key, value]) => {
    params[key] = value;
  });

  try {
    if (params.vendor_name) {
      const vendorId = await new Promise((resolve, reject) => {
        salesModel.checkVendorExists(params, (error, vendorId) => {
          if (error) {
            reject(error);
          } else {
            resolve(vendorId);
          }
        });
      });

      if (!vendorId) {
        return res.status(404).json({
          message: `거래처가 존재하지 않습니다. \n사업자에 등록된 거래처를 입력해주세요`,
        });
      } else {
        params.vendor_id = vendorId;
      }
    }
    if (params.product_name) {
      const productId = await new Promise((resolve, reject) => {
        salesModel.checkProductExists(params, (error, productId) => {
          if (error) {
            reject(error);
          } else {
            resolve(productId);
          }
        });
      });

      if (!productId) {
        return res.status(404).json({
          message: `제품이 존재하지 않습니다. \n사업자에 등록된 제품을 입력해주세요`,
        });
      } else {
        params.product_id = productId;
      }
    }

    if (params.payment_name) {
      const paymentId = await new Promise((resolve, reject) => {
        salesModel.checkPaymentExists(params, (error, paymentId) => {
          if (error) {
            reject(error);
          } else {
            resolve(paymentId);
          }
        });
      });

      if (!paymentId) {
        return res.status(404).json({
          message: `결제수단이 존재하지 않습니다. \n사업자에 등록된 결제수단을 입력해주세요`,
        });
      } else {
        params.payment_id = paymentId;
      }
    }
    if (typeof params.qty === "string") {
      params.qty = params.qty.replace(/,/g, "");
    }
    if (typeof params.unit_price === "string") {
      params.unit_price = params.unit_price.replace(/,/g, "");
    }
    if (typeof params.total_sales === "string") {
      params.total_sales = params.total_sales.replace(/,/g, "");
    }

    //total_

    salesModel.updateSales(params, (error, affectedRows) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "중복된 데이터 입니다." });
        } else {
          return res.status(500).json({ message: "업데이트에 실패했습니다." });
        }
      }
      if (affectedRows === 0) {
        return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
      }
      res.json({ message: "정상적으로 업데이트 되었습니다." });
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred." });
  }
}

//거래처 정보 삭제 핸들러

function deleteSales(req, res) {
  const sales_id = req.params.sales_id;
  //req.params.sales_id 가 list로 넘어옴
  salesModel.deleteSales(sales_id, (error, affectedRows) => {
    if (error) {
      return res.status(500).json({ message: "삭제에 실패했습니다." });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
    }
    res.json({ message: "정상적으로 삭제되었습니다." });
  });
}

//getMonthlySales
function getMonthlySales(req, res) {
  const params = {
    business_id: req.query.business_id,
  };

  salesModel.getMonthlySales(params, (error, sales) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(sales);
  });
}

//getMonthlySalesByBusiness
function getMonthlySalesByBusiness(req, res) {
  const params = {
    yyyy: req.query.yyyy,
    mm: req.query.mm,
  };

  salesModel.getMonthlySalesByBusiness(params, (error, sales) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(sales);
  });
}

//getAnnualSales
function getAnnualSales(req, res) {
  const params = {
    yyyy: req.query.yyyy,
    business_id: req.query.business_id,
  };

  salesModel.getAnnualSales(params, (error, sales) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(sales);
  });
}

//getAnnualProfit
function getAnnualProfit(req, res) {
  const params = {
    yyyy: req.query.yyyy,
    business_id: req.query.business_id,
  };

  salesModel.getAnnualProfit(params, (error, sales) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(sales);
  });
}

//getMonthlySalesByVendor
function getMonthlySalesByVendor(req, res) {
  const params = {
    business_id: req.query.business_id,
    yyyy: req.query.yyyy,
    mm: req.query.mm,
  };

  salesModel.getMonthlySalesByVendor(params, (error, sales) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(sales);
  });
}

//getVendorMonthlySales
function getVendorMonthlySales(req, res) {
  const params = {
    business_id: req.query.business_id,
    vendor_id: req.query.vendor_id,
  };

  salesModel.getVendorMonthlySales(params, (error, sales) => {
    if (error) {
      return res.status(500).json({ message: "조회에 실패했습니다." });
    }
    res.json(sales);
  });
}
module.exports = {
  getSales,
  createSales,
  updateSales,
  deleteSales,
  getMonthlySales,
  getMonthlySalesByBusiness,
  getAnnualProfit,
  getAnnualSales,
  getMonthlySalesByVendor,
  getVendorMonthlySales,
};
