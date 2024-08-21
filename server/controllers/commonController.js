const common = require("../models/common");

async function getBusinessId(params) {
  return new Promise((resolve, reject) => {
    common.getBusinessId(params, (error, business_id) => {
      if (error) {
        reject(error);
      } else {
        resolve(business_id);
      }
    });
  });
}

async function getVendorId(params) {
  return new Promise((resolve, reject) => {
    common.getVendorId(params, (error, vendor_id) => {
      if (error) {
        reject(error);
      } else {
        resolve(vendor_id);
      }
    });
  });
}

async function getProductId(params) {
  return new Promise((resolve, reject) => {
    common.getProductId(params, (error, product_id) => {
      if (error) {
        reject(error);
      } else {
        resolve(product_id);
      }
    });
  });
}

async function getPaymentId(params) {
  return new Promise((resolve, reject) => {
    common.getPaymentId(params, (error, payment_id) => {
      if (error) {
        reject(error);
      } else {
        resolve(payment_id);
      }
    });
  });
}

//Master Code 와 Detail name 을 받아서 Detail Code 를 리턴
async function getDetailCode(params) {
  return new Promise((resolve, reject) => {
    common.getDetailCode(params, (error, detail_code) => {
      if (error) {
        reject(error);
      } else {
        resolve(detail_code);
      }
    });
  });
}

module.exports = {
  getBusinessId,
  getVendorId,
  getProductId,
  getPaymentId,
  getDetailCode,
};
