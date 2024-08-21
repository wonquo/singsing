const mysql = require("mysql");
const dbConfig = require("../dbConfig");
const connection = mysql.createConnection(dbConfig);

class vendorModel {
  /*        
business_id: '사업자',
vendor_name: '거래처명',
ceo: '대표자',
phone_number: '전화번호',
fax_number: '팩스번호',
contact_person: '담당자',
contact_number: '연락처',
business_type: '업태',
business_items: '종목',
address: '주소'
*/
  constructor(
    vendor_id,
    business_id,
    business_name,
    vendor_name,
    ceo,
    business_number,
    phone_number,
    fax_number,
    contact_person,
    contact_number,
    business_type,
    business_items,
    address,
    remarks
  ) {
    this.vendor_id = vendor_id;
    this.business_id = business_id;
    this.business_name = business_name;
    this.vendor_name = vendor_name;
    this.ceo = ceo;
    this.business_number = business_number;
    this.phone_number = phone_number;
    this.fax_number = fax_number;
    this.contact_person = contact_person;
    this.contact_number = contact_number;
    this.business_type = business_type;
    this.business_items = business_items;
    this.address = address;
    this.remarks = remarks;
  }
}

function getVendor(business_id, vendor_name, ceo, callback) {
  let query = "/*getVendor*/";
  query += `
    SELECT vendor_id,
           tb.business_name,
           tb.business_id, 
           vendor_name,           
           ceo, 
           tv.business_number,
           phone_number, 
           fax_number, 
           contact_person, 
           contact_number, 
           business_type, 
           business_items, 
           address,
           remarks
    FROM   tb_vendor tv,
           tb_business tb
    WHERE  tv.business_id = tb.business_id`;
  let params = [];
  if (business_id && business_id !== "all") {
    query += " AND tv.business_id = ?";
    params.push(business_id);
  }
  if (vendor_name) {
    query += " AND UPPER(vendor_name) like UPPER(?)";
    params.push("%" + vendor_name + "%");
  }
  if (ceo) {
    query += " AND UPPER(ceo) like UPPER(?)";
    params.push("%" + ceo + "%");
  }

  console.log(connection.format(query, params));
  connection.query(query, params, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch vendor: ", error);
      return callback(error);
    }
    const vendor = results.map(
      (row) =>
        new vendorModel(
          row.vendor_id,
          row.business_id,
          row.business_name,
          row.vendor_name,
          row.ceo,
          row.business_number,
          row.phone_number,
          row.fax_number,
          row.contact_person,
          row.contact_number,
          row.business_type,
          row.business_items,
          row.address,
          row.remarks
        )
    );
    callback(null, vendor);
  });
}

function createVendor(vendor, callback) {
  const query = `
      INSERT INTO tb_vendor (
        business_id,
        vendor_name,
        ceo,
        business_number,
        phone_number,
        fax_number,
        contact_person,
        contact_number,
        business_type,
        business_items,
        address,
        remarks
      ) VALUES 
      (?, 
       ?,
       ?,
       ?, 
       ?, 
       ?, 
       ?, 
       ?, 
       ?, 
       ?, 
       ?, 
       ?)
    `;

  // vendor 객체에서 누락된 필드를 확인하고 기본값을 제공합니다.
  const params = [
    vendor.business_id || "", // 예상되는 필드: business_id
    vendor.vendor_name || "", // 예상되는 필드: vendor_name
    vendor.ceo || "", // 예상되는 필드: ceo
    vendor.business_number || "", // 예상되는 필드: business_number
    vendor.phone_number || "", // 예상되는 필드: phone_number
    vendor.fax_number || "", // 예상되는 필드: fax_number
    vendor.contact_person || "", // 예상되는 필드: contact_person
    vendor.contact_number || "", // 예상되는 필드: contact_number
    vendor.business_type || "", // 예상되는 필드: business_type
    vendor.business_items || "", // 예상되는 필드: business_items
    vendor.address || "", // 예상되는 필드: address
    vendor.remarks || "", // 예상되는 필드: address
  ];

  console.log("/*createVendors*/");
  console.log(connection.format(query, params));
  connection.query(query, params, (error, results) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return callback(error, null);
      } else {
        console.error("Failed to create vendor: ", error);
        return callback(error, null);
      }
    }
    callback(null, results.insertId);
  });
}

//updateVendor
function updateVendor(vendor_id, updatedVendor, callback) {
  const query = "UPDATE tb_vendor SET ? WHERE vendor_id = ?";
  console.log("/*updateVendor*/");
  console.log(connection.format(query, [updatedVendor, vendor_id]));
  connection.query(query, [updatedVendor, vendor_id], (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to update vendor: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

//deleteVendor
function deleteVendor(vendor_id, callback) {
  console.log("vendor_id: ", vendor_id);
  const query = "DELETE FROM tb_vendor WHERE vendor_id = ?";
  connection.query(query, vendor_id, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to delete vendor: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

module.exports = {
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
};
