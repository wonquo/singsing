const mysql = require("mysql");
const dbConfig = require("../dbConfig");
const connection = mysql.createConnection(dbConfig);

class commonCodeMasterModel {
  constructor(master_id, code, name, description, use_yn) {
    this.master_id = master_id;
    this.code = code;
    this.name = name;
    this.description = description;
    this.use_yn = use_yn;
  }
}

class commonCodeDetailModel {
  constructor(
    detail_id,
    master_id,
    code,
    name,
    description,
    use_yn,
    sort_seq,
    start_date,
    end_date,
    attribute1,
    attribute2,
    attribute3,
    attribute4,
    attribute5
  ) {
    this.detail_id = detail_id;
    this.master_id = master_id;
    this.code = code;
    this.name = name;
    this.description = description;
    this.use_yn = use_yn;
    this.sort_seq = sort_seq;
    this.start_date = start_date;
    this.end_date = end_date;
    this.attribute1 = attribute1;
    this.attribute2 = attribute2;
    this.attribute3 = attribute3;
    this.attribute4 = attribute4;
    this.attribute5 = attribute5;
  }
}

//마스터 코드 조회
function getCommonCodeMaster(params, callback) {
  const { code, name } = params;

  let query = "/*getCommonCodeMaster*/";
  query += `
    SELECT  master_id,
            code,
            name,
            description,
            use_yn
    FROM   tb_code_master cm
    WHERE  1=1
    `;
  let queryParams = [];
  if (code) {
    query += " AND UPPER(cm.code) like UPPER(?)";
    queryParams.push("%" + code + "%");
  }
  if (name) {
    query += " AND UPPER(cm.name) like UPPER(?)";
    queryParams.push("%" + name + "%");
  }

  console.log(connection.format(query, queryParams));
  connection.query(query, queryParams, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch getCommonCodeMaster: ", error);
      return callback(error);
    }
    const commonCodeMaster = results.map(
      (row) =>
        new commonCodeMasterModel(
          row.master_id,
          row.code,
          row.name,
          row.description,
          row.use_yn
        )
    );
    callback(null, commonCodeMaster);
  });
}

//디테일 코드 조회
function getCommonCodeDetail(params, callback) {
  const { master_id } = params;

  let query = "/*getCommonCodeDetail*/";
  query += `
    SELECT  detail_id,
            master_id,
            code,
            name,
            description,
            use_yn,
            sort_seq,
            start_date,
            end_date,
            attribute1,
            attribute2,
            attribute3,
            attribute4,
            attribute5
    FROM   tb_code_detail cd
    WHERE  1=1
    `;
  let queryParams = [];
  if (master_id) {
    query += " AND cd.master_id = ?";
    queryParams.push(master_id);
  }
  //order by sort_seq
  query += " ORDER BY sort_seq";

  console.log(connection.format(query, queryParams));
  connection.query(query, queryParams, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch getCommonCodeDetail: ", error);
      return callback(error);
    }
    const commonCodeDetail = results.map(
      (row) =>
        new commonCodeDetailModel(
          row.detail_id,
          row.master_id,
          row.code,
          row.name,
          row.description,
          row.use_yn,
          row.sort_seq,
          row.start_date,
          row.end_date,
          row.attribute1,
          row.attribute2,
          row.attribute3,
          row.attribute4,
          row.attribute5
        )
    );
    callback(null, commonCodeDetail);
  });
}

function createCommonCodeMaster(commonCodeMaster, callback) {
  const query = `
      INSERT INTO tb_code_master (
        code,
        name,
        description,
        use_yn
      ) VALUES 
      (
        ?,
        ?,
        ?,
        ?
      )
    `;

  const params = [
    commonCodeMaster.code,
    commonCodeMaster.name,
    commonCodeMaster.description,
    commonCodeMaster.use_yn,
  ];

  console.log("/*createCommonCodeMaster*/");
  console.log(connection.format(query, params));
  connection.query(query, params, (error, results) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return callback(error, null);
      } else {
        console.error("Failed to create createCommonCodeMaster: ", error);
        return callback(error, null);
      }
    }
    callback(null, results.insertId);
  });
}

function createCommonCodeDetail(commonCodeDetail, callback) {
  const query = `
      INSERT INTO tb_code_detail (
        master_id,
        code,
        name,
        description,
        use_yn,
        sort_seq,
        start_date,
        end_date,
        attribute1,
        attribute2,
        attribute3,
        attribute4,
        attribute5
      ) VALUES 
      (
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
        ?,
        ?,
        ?
      )
    `;

  const params = [
    commonCodeDetail.master_id,
    commonCodeDetail.code,
    commonCodeDetail.name,
    commonCodeDetail.description,
    commonCodeDetail.use_yn,
    commonCodeDetail.sort_seq,
    commonCodeDetail.start_date,
    commonCodeDetail.end_date,
    commonCodeDetail.attribute1,
    commonCodeDetail.attribute2,
    commonCodeDetail.attribute3,
    commonCodeDetail.attribute4,
    commonCodeDetail.attribute5,
  ];

  console.log("/*createCommonCodeDetail*/");
  console.log(connection.format(query, params));
  connection.query(query, params, (error, results) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return callback(error, null);
      } else {
        console.error("Failed to create createCommonCodeDetail: ", error);
        return callback(error, null);
      }
    }
    callback(null, results.insertId);
  });
}

//updateCommonCodeMaster
function updateCommonCodeMaster(master_id, updatedCommonCodeMaster, callback) {
  const query = "UPDATE tb_code_master SET ? WHERE master_id = ?";
  console.log("/*updateCommonCodeMaster*/");
  console.log(connection.format(query, [updatedCommonCodeMaster, master_id]));
  connection.query(
    query,
    [updatedCommonCodeMaster, master_id],
    (error, results) => {
      if (error) {
        console.log("Query error: ", query);
        console.error("Failed to update updateCommonCodeMaster: ", error);
        return callback(error);
      }
      callback(null, results.affectedRows);
    }
  );
}

//updateCommonCodeDetail
function updateCommonCodeDetail(detail_id, updatedCommonCodeDetail, callback) {
  const query = "UPDATE tb_code_detail SET ? WHERE detail_id = ?";
  console.log("/*updateCommonCodeDetail*/");
  console.log(connection.format(query, [updatedCommonCodeDetail, detail_id]));
  connection.query(
    query,
    [updatedCommonCodeDetail, detail_id],
    (error, results) => {
      if (error) {
        console.log("Query error: ", query);
        console.error("Failed to update updatedCommonCodeDetail: ", error);
        return callback(error);
      }
      callback(null, results.affectedRows);
    }
  );
}

//deleteCommonCodeMaster
function deleteCommonCodeMaster(master_id, callback) {
  const query = "DELETE FROM tb_code_master WHERE master_id = ?";
  connection.query(query, master_id, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to delete deleteCommonCodeMaster: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

//deleteCommonCodeDetail
function deleteCommonCodeDetail(detail_id, callback) {
  const query = "DELETE FROM tb_code_detail WHERE detail_id = ?";
  connection.query(query, detail_id, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to delete deleteCommonCodeDetail: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

//getCommonCode : master_code 로 detail_code list 조회
function getCommonCode(params, callback) {
  const { master_code } = params;

  let query = "/*getCommonCode*/";
  query += `
    SELECT  cd.code,
            cd.name
    FROM   tb_code_master cm
           JOIN tb_code_detail cd
             ON cm.master_id = cd.master_id
    WHERE  cm.code = ?
    ORDER BY cd.sort_seq
    `;

  console.log(connection.format(query, master_code));
  connection.query(query, master_code, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch getCommonCode: ", error);
      return callback(error);
    }
    const commonCode = results.map((row) => ({
      code: row.code,
      name: row.name,
    }));
    callback(null, commonCode);
  });
}

module.exports = {
  getCommonCodeMaster,
  getCommonCodeDetail,
  createCommonCodeMaster,
  createCommonCodeDetail,
  updateCommonCodeMaster,
  updateCommonCodeDetail,
  deleteCommonCodeMaster,
  deleteCommonCodeDetail,
  getCommonCode,
};
