const mysql = require("mysql");
const dbConfig = require("../dbConfig");
const connection = mysql.createConnection(dbConfig);

class salesModel {
  constructor(
    sales_id,
    business_id,
    vendor_id,
    product_id,
    payment_id,
    sales_date,
    business_name,
    vendor_name,
    tax,
    payment_name,
    product_name,
    qty,
    unit_price,
    total_sales,
    remarks
  ) {
    this.sales_id = sales_id;
    this.business_id = business_id;
    this.vendor_id = vendor_id;
    this.product_id = product_id;
    this.payment_id = payment_id;
    this.sales_date = sales_date;
    this.business_name = business_name;
    this.vendor_name = vendor_name;
    this.tax = tax;
    this.payment_name = payment_name;
    this.product_name = product_name;
    this.qty = qty;
    this.unit_price = unit_price;
    this.total_sales = total_sales;
    this.remarks = remarks;
  }
}

class salesMonthModel {
  /*        
    sales_month INT AUTO_INCREMENT PRIMARY KEY,
    total_sales DECIMAL(10, 2)  NULL,*/
  constructor(
    business_id,
    business_name,
    sales_month,
    total_sales,
    sales_growth_rate,
    profit,
    yyyy,
    mm
  ) {
    this.business_id = business_id;
    this.business_name = business_name;
    this.sales_month = sales_month;
    this.total_sales = total_sales;
    this.sales_growth_rate = sales_growth_rate;
    this.profit = profit;
    this.yyyy = yyyy;
    this.mm = mm;
  }
}

class salesAnnualModel {
  constructor(yyyy, total_sales, previous_year_sales, sales_growth_rate) {
    this.yyyy = yyyy;
    this.total_sales = total_sales;
    this.previous_year_sales = previous_year_sales;
    this.sales_growth_rate = sales_growth_rate;
  }
}

class salesProfitModel {
  constructor(yyyy, profit) {
    this.yyyy = yyyy;
    this.profit = profit;
  }
}

class salesVendorModel {
  constructor(
    business_name,
    business_id,
    vendor_name,
    sales_month,
    total_sales,
    sales_growth_rate
  ) {
    this.business_name = business_name;
    this.business_id = business_id;
    this.vendor_name = vendor_name;
    this.sales_month = sales_month;
    this.total_sales = total_sales;
    this.sales_growth_rate = sales_growth_rate;
  }
}

function getSales(params, callback) {
  const { business_id, vendor_name, from_date, to_date } = params;

  let query = "/*getSales*/";
  query += `
    SELECT  ts.sales_id,
    ts.business_id,
    ts.vendor_id,
    ts.payment_id,
    ts.product_id,
    CONCAT(SUBSTRING(ts.sales_date, 1, 4), '-', SUBSTRING(ts.sales_date, 5, 2)) sales_date,
    tb.business_name,
    tv.vendor_name,
    tp.tax,
    tp.payment_name,
    td.product_name,
    ts.qty,
    ts.unit_price,
    ts.total_sales,
    ts.remarks
  FROM    tb_sales ts
  LEFT OUTER JOIN tb_business tb ON ts.business_id = tb.business_id
  LEFT OUTER JOIN tb_vendor tv ON ts.vendor_id = tv.vendor_id
  LEFT OUTER JOIN tb_payment tp ON ts.payment_id = tp.payment_id
  LEFT OUTER JOIN tb_product td ON ts.product_id = td.product_id
  WHERE 1=1
    `;
  let queryParams = [];
  if (!isNaN(business_id) && business_id !== "all") {
    query += " AND ts.business_id = ?";
    queryParams.push(business_id);
  }
  if (vendor_name) {
    query += " AND UPPER(vendor_name) like UPPER(?)";
    queryParams.push("%" + vendor_name + "%");
  }
  if (from_date) {
    query += " AND ts.sales_date >=  REPLACE(?,'-','')";
    queryParams.push(from_date);
  }
  if (to_date) {
    query += " AND ts.sales_date <=  REPLACE(?,'-','')";
    queryParams.push(to_date);
  }

  query += " ORDER BY ts.sales_date ";

  console.log(connection.format(query, queryParams));
  connection.query(query, queryParams, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch sales: ", error);
      return callback(error);
    }

    // 월매출 데이터를 salesModel 객체로 변환
    const sales = results.map(
      (row) =>
        new salesModel(
          row.sales_id,
          row.business_id,
          row.vendor_id,
          row.product_id,
          row.payment_id,
          row.sales_date,
          row.business_name,
          row.vendor_name,
          row.tax,
          row.payment_name,
          row.product_name,
          row.qty,
          row.unit_price,
          row.total_sales,
          row.remarks
        )
    );
    callback(null, sales);
  });
}

function checkVendorExists(params, callback) {
  const { business_id, vendor_name } = params;
  const query =
    "SELECT vendor_id FROM tb_vendor WHERE vendor_name = ? AND business_id = ?";

  console.log("/*checkVendorExists*/");
  console.log(connection.format(query, [vendor_name, business_id]));
  connection.query(query, [vendor_name, business_id], (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to check vendor: ", error);
      return callback(error); // Return error via callback
    }
    // Check if results exist and pass vendor_id back via callback
    if (results.length > 0) {
      const vendor_id = results[0].vendor_id;
      return callback(null, vendor_id);
    } else {
      return callback(null, null);
    }
  });
}
function checkProductExists(params, callback) {
  const { business_id, product_name } = params;
  const query =
    "SELECT product_id FROM tb_product WHERE product_name = ? AND business_id = ?";

  console.log("/*checkProductExists*/");
  console.log(connection.format(query, [product_name, business_id]));
  connection.query(query, [product_name, business_id], (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to check product: ", error);
      return callback(error); // Return error via callback
    }
    // Check if results exist and pass product_id back via callback
    if (results.length > 0) {
      const product_id = results[0].product_id;
      return callback(null, product_id);
    } else {
      return callback(null, null);
    }
  });
}
function checkPaymentExists(params, callback) {
  const query = `
  SELECT  payment_id 
  FROM    tb_payment tp
      ,   tb_vendor tv
  WHERE   tp.vendor_id = tp.vendor_id 
  AND     tp.payment_name = ? 
  AND     tp.tax = ? 
  AND     tp.business_id = ?
  AND 	  tv.vendor_id = ?
`;

  console.log("/*checkPaymentExists*/");
  console.log(
    connection.format(query, [
      params.payment_name,
      params.tax,
      params.business_id,
      params.vendor_id,
    ])
  );
  connection.query(
    query,
    [params.payment_name, params.tax, params.business_id, params.vendor_id],
    (error, results) => {
      if (error) {
        console.log("Query error: ", query);
        console.error("Failed to check payment: ", error);
        return callback(error); // Return error via callback
      }
      // Check if results exist and pass payment_id back via callback
      if (results.length > 0) {
        const payment_id = results[0].payment_id;
        return callback(null, payment_id);
      } else {
        return callback(null, null);
      }
    }
  );
}

function checkBusinessExists(business_id, business_name, callback) {
  const query =
    "SELECT business_id FROM tb_business WHERE business_name = ? AND business_id = ?";

  console.log("/*checkProductExists*/");
  console.log(connection.format(query, [business_name, business_id]));
  connection.query(query, [business_name, business_id], (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to check business: ", error);
      return callback(error); // Return error via callback
    }
    // Check if results exist and pass business_id back via callback
    if (results.length > 0) {
      const business_id = results[0].business_id;
      return callback(null, business_id);
    } else {
      return callback(null, null);
    }
  });
}

function createSales(params, callback) {
  const query = `
  INSERT INTO tb_sales (
    business_id,
    sales_date,
    vendor_id,
    payment_id,
    product_id,
    qty,
    unit_price,
    total_sales,
    remarks
) VALUES (
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

  const queryParams = [
    params.business_id,
    params.sales_date.replace("-", ""),
    params.vendor_id,
    params.payment_id,
    params.product_id,
    isNaN(params.qty)
      ? params.qty
        ? params.qty.replace(/,/g, "")
        : null
      : params.qty, // Check if params.qty is defined before accessing its properties
    isNaN(params.unit_price)
      ? params.unit_price
        ? params.unit_price.replace(/,/g, "")
        : null
      : params.unit_price, // Check if params.unit_price is defined before accessing its properties
    isNaN(params.total_sales)
      ? params.total_sales
        ? params.total_sales.replace(/,/g, "")
        : null
      : params.total_sales, // Check if params.total_sales is defined before accessing its properties
    params.remarks,
  ];

  console.log("/*createSaless*/");
  console.log(connection.format(query, queryParams));
  connection.query(query, queryParams, (error, results) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return callback(error, null);
      } else {
        console.error("Failed to create sales: ", error);
        return callback(error, null);
      }
    }
    callback(null, results.insertId);
  });
}

//updateSales
function updateSales(params, callback) {
  const updatedData = {};
  if (params.business_id) updatedData.business_id = params.business_id;
  if (params.sales_date)
    updatedData.sales_date = params.sales_date.replace("-", "");
  if (params.vendor_id) updatedData.vendor_id = params.vendor_id;
  if (params.payment_id) updatedData.payment_id = params.payment_id;
  if (params.product_id) updatedData.product_id = params.product_id;
  updatedData.qty = params.qty;
  updatedData.unit_price = params.unit_price;
  if (params.total_sales) updatedData.total_sales = params.total_sales;
  updatedData.remarks = params.remarks;

  const query = "UPDATE tb_sales SET ? WHERE sales_id = ?";
  console.log("/*updateSales*/");
  console.log(connection.format(query, [updatedData, params.sales_id]));
  connection.query(query, [updatedData, params.sales_id], (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to update sales: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

//deleteSales
function deleteSales(sales_id, callback) {
  console.log("/*deleteSales*/");
  const query = "DELETE FROM tb_sales WHERE sales_id = ?";
  connection.query(query, sales_id, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to delete sales: ", error);
      return callback(error);
    }
    callback(null, results.affectedRows);
  });
}

function getMonthlySales(params, callback) {
  //현재 월로부터 12개월 전까지의 월별 매출을 조회
  let { business_id } = params;

  let query = "/*getMonthlySales*/";
  query += `
  SELECT
  tb.business_id,
  tb.business_name,
  CONCAT(
    DATE_FORMAT(DATE_SUB(NOW(), INTERVAL seq.seq MONTH), '%Y'),
    '-',
    DATE_FORMAT(DATE_SUB(NOW(), INTERVAL seq.seq MONTH), '%m')
  ) AS sales_month,
  COALESCE(SUM(ts.total_sales), 0) AS total_sales
FROM
  tb_business tb
LEFT JOIN (
  SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11
) AS seq ON seq.seq <= 11
LEFT OUTER JOIN
  tb_sales ts ON ts.business_id = tb.business_id AND 
  ts.sales_date >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL seq.seq MONTH), '%Y%m') AND 
  ts.sales_date <= DATE_FORMAT(LAST_DAY(DATE_SUB(NOW(), INTERVAL seq.seq MONTH)), '%Y%m%d')
  `;
  let queryParams = [];
  if (business_id) {
    query += " AND ts.business_id = ?";
    queryParams.push(business_id);
  } else {
    business_id = 0;
  }
  query += `
  GROUP BY
    tb.business_id, sales_month
  ORDER BY
    tb.business_id, sales_month
`;
  console.log(connection.format(query, queryParams));
  connection.query(query, queryParams, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch monthly sales: ", error);
      return callback(error);
    }
    // 월매출 데이터를 salesModel 객체로 변환
    const monthlySales = results.map(
      (row) =>
        new salesMonthModel(
          row.business_id,
          row.business_name,
          row.sales_month,
          row.total_sales
        )
    );
    callback(null, monthlySales);
  });
}

//getVendorMonthlySales
function getVendorMonthlySales(params, callback) {
  //현재 월로부터 12개월 전까지의 사업자별 거래처 월별 매출을 조회
  let { business_id, vendor_id } = params;

  let queryParams = [];
  let query = "/*getVendorMonthlySales*/";
  query += `
  SELECT
  tv.vendor_id,
  tv.vendor_name,
  CONCAT(
    DATE_FORMAT(DATE_SUB(NOW(), INTERVAL seq.seq MONTH), '%Y'),
    '-',
    DATE_FORMAT(DATE_SUB(NOW(), INTERVAL seq.seq MONTH), '%m')
  ) AS sales_month,
  COALESCE(SUM(ts.total_sales), 0) AS total_sales
FROM
  tb_vendor tv

  LEFT JOIN (
    SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11
  ) AS seq ON seq.seq <= 11
  LEFT OUTER JOIN
    tb_sales ts ON ts.vendor_id = tv.vendor_id AND 
    ts.business_id = tv.business_id AND 
    ts.sales_date >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL seq.seq MONTH), '%Y%m') AND 
    ts.sales_date <= DATE_FORMAT(LAST_DAY(DATE_SUB(NOW(), INTERVAL seq.seq MONTH)), '%Y%m%d')`;
  if (vendor_id) {
    query += ` AND ts.vendor_id = ?`;
    queryParams.push(vendor_id);
  }
  query += `
  WHERE
    tv.business_id = ?
  `;
  queryParams.push(business_id);

  query += `
  GROUP BY
    tv.vendor_id, sales_month
  ORDER BY
    tv.vendor_id, sales_month
`;

  console.log(connection.format(query, queryParams));

  connection.query(query, queryParams, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch monthly sales: ", error);
      return callback(error);
    }

    // 월매출 데이터를 salesModel 객체로 변환
    const monthlySales = results.map(
      (row) =>
        new salesMonthModel(
          row.vendor_id,
          row.vendor_name,
          row.sales_month,
          row.total_sales
        )
    );
    callback(null, monthlySales);
  });
}

function getMonthlySalesByBusiness(params, callback) {
  let { yyyy, mm } = params;
  let date = yyyy + mm;
  let lastYear = (parseInt(yyyy) - 1).toString() + mm;
  console.log("test", date, lastYear);
  let query = "/*getMonthlySalesByBusiness*/";
  query += `
  SELECT a.*,
        /*매출액 증감률*/
        /*고객 요청 : 전년도 동월과 비교 해달라 */
         CASE
            WHEN a.total_sales = 0 THEN 0
            ELSE (a.total_sales - IFNULL(b.total_sales, 0)) / IFNULL(b.total_sales, 1)
          END AS sales_growth_rate,
          /*이익 추가 */
          /*고객 요청 : 월간 매출이지만 이익은 당해 이익으로 보여달라*/
          ((SELECT IFNULL(SUM(ts.total_sales),0)
           FROM   tb_sales ts
           WHERE  SUBSTRING(ts.sales_date, 1, 4) = ? 
           AND    (a.business_id = 0 OR ts.business_id = a.business_id)) -
          (SELECT IFNULL(SUM(tp.total_amount),0)
           FROM   tb_purchase tp
           WHERE  DATE_FORMAT(tp.issue_date, '%Y') = ?
           AND    (a.business_id = 0 OR tp.business_id = a.business_id))) AS profit
          


  FROM (
    SELECT  tb.business_id,
            CONCAT(tb.business_name,' 월간 매출액') business_name,
            CONCAT(SUBSTRING(?, 1, 4), '-', SUBSTRING(?, 5, 2)) sales_month,
            IFNULL(SUM(ts.total_sales), 0) total_sales
    FROM    tb_business tb
    LEFT OUTER JOIN tb_sales ts ON ts.business_id = tb.business_id AND SUBSTRING(ts.sales_date, 1, 6) = ?
    GROUP BY tb.business_id, SUBSTRING(ts.sales_date, 1, 6)
    UNION ALL 
    SELECT  0 business_id,
            '전체 월간 매출액' business_name,
            CONCAT(SUBSTRING(?, 1, 4), '-', SUBSTRING(?, 5, 2)) sales_month,
            IFNULL(SUM(ts.total_sales), 0) total_sales
    FROM    (SELECT 1 ) AS dummy 
    LEFT JOIN tb_sales ts ON SUBSTRING(ts.sales_date, 1, 6) = ?
    GROUP BY SUBSTRING(ts.sales_date, 1, 6)
  ) a
  LEFT JOIN (
    SELECT  tb.business_id,
            IFNULL(SUM(ts.total_sales), 0) total_sales
    FROM    tb_business tb
    LEFT OUTER JOIN tb_sales ts ON ts.business_id = tb.business_id AND SUBSTRING(ts.sales_date, 1, 6) = ?
    GROUP BY tb.business_id, SUBSTRING(ts.sales_date, 1, 6)
    UNION ALL 
    SELECT  0 business_id,
            IFNULL(SUM(ts.total_sales), 0) total_sales
    FROM    (SELECT 1 ) AS dummy 
    LEFT JOIN tb_sales ts ON SUBSTRING(ts.sales_date, 1, 6) = ?
    GROUP BY SUBSTRING(ts.sales_date, 1, 6)
  ) b
  ON a.business_id = b.business_id
  ORDER BY a.business_id
`;
  let queryParams = [
    yyyy,
    yyyy,
    date,
    date,
    date,
    date,
    date,
    date,
    lastYear,
    lastYear,
  ];

  console.log(connection.format(query, queryParams));
  connection.query(query, queryParams, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch monthly sales: ", error);
      return callback(error);
    }

    // 월매출 데이터를 salesModel 객체로 변환
    const monthlySales = results.map(
      (row) =>
        new salesMonthModel(
          row.business_id,
          row.business_name,
          row.sales_month,
          row.total_sales,
          row.sales_growth_rate,
          row.profit,
          yyyy,
          mm
        )
    );
    callback(null, monthlySales);
  });
}

//getAnnualSales
function getAnnualSales(params, callback) {
  //현재 월로부터 12개월 전까지의 월별 매출을 조회
  let { yyyy, business_id } = params;
  let previousYear = (yyyy - 1).toString(); // 문자열로 변환

  // 현재기준 이전달
  let nowDate = new Date();
  nowDate.setMonth(nowDate.getMonth() - 1);
  let nowYyyyMm = nowDate.toISOString().slice(0, 7).replace(/-/g, "");
  let displayYyyyMm = nowDate.toISOString().slice(0, 7); // yyyy-mm

  let nowMm = nowDate
    .toISOString()
    .slice(0, 7)
    .replace(/-/g, "")
    .substring(4, 6);
  let previousYearMonth = previousYear + nowMm;

  //yyyy 가 현재년도 인지 체크
  let nowYearFlag = yyyy === new Date().getFullYear().toString() ? "Y" : "N";

  let query = "/*getAnnualSales*/";
  let queryParams = [];

  query += `
    SELECT 
        SUM(ts.total_sales) AS total_sales,
        (SELECT 
            SUM(ts2.total_sales) 
        FROM 
            tb_sales ts2 
        WHERE 
            SUBSTRING(ts2.sales_date, 1, 4) = ?
    `;

  queryParams.push(previousYear);

  if (nowYearFlag === "Y") {
    query += ` AND SUBSTRING(ts2.sales_date, 1, 6) <= ?`;
    queryParams.push(previousYearMonth);
  }

  if (business_id && business_id !== "all") {
    query += " AND ts2.business_id = ?";
    queryParams.push(business_id);
  }
  query += `) AS previous_year_sales,
        ((SUM(ts.total_sales) - (SELECT SUM(ts2.total_sales) 
                                FROM tb_sales ts2 
                                WHERE SUBSTRING(ts2.sales_date, 1, 4) = ?`;

  // tb_sales ts2의 추가적인 조회 조건 및 연도 설정
  queryParams.push(previousYear);

  if (nowYearFlag === "Y") {
    query += ` AND SUBSTRING(ts2.sales_date, 1, 6) <= ?`;
    queryParams.push(previousYearMonth);
  }

  if (business_id && business_id !== "all") {
    query += " AND ts2.business_id = ?";
    queryParams.push(business_id);
  }

  query += `)) / 
        (SELECT SUM(ts2.total_sales) 
        FROM tb_sales ts2 
        WHERE SUBSTRING(ts2.sales_date, 1, 4) = ?`;

  // tb_sales ts2의 추가적인 조회 조건 및 연도 설정
  queryParams.push(previousYear);

  if (nowYearFlag === "Y") {
    query += ` AND SUBSTRING(ts2.sales_date, 1, 6) <= ?`;
    queryParams.push(previousYearMonth);
  }

  if (business_id && business_id !== "all") {
    query += " AND ts2.business_id = ?";
    queryParams.push(business_id);
  }

  query += `)) AS sales_growth_rate
    FROM 
        tb_sales ts
    WHERE 
        SUBSTRING(ts.sales_date, 1, 4) = ?`; // 2024년 매출액

  // ts의 조회 조건 및 연도 설정
  queryParams.push(yyyy);

  if (nowYearFlag === "Y") {
    query += ` AND SUBSTRING(ts.sales_date, 1, 6) <= ?`;
    queryParams.push(nowYyyyMm);
  }

  if (business_id && business_id !== "all") {
    query += " AND ts.business_id = ?";
    queryParams.push(business_id);
  }

  console.log(connection.format(query, queryParams));
  connection.query(query, queryParams, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch annual sales: ", error);
      return callback(error);
    }
    // 월매출 데이터를 salesAnnualModel
    const annualSales = results.map(
      (row) =>
        new salesAnnualModel(
          nowYearFlag === "Y" ? displayYyyyMm : yyyy,
          row.total_sales,
          row.previous_year_sales,
          row.sales_growth_rate
        )
    );
    callback(null, annualSales);
  });
}

function getAnnualProfit(params, callback) {
  let { yyyy, business_id } = params;

  // 현재기준 이전달
  let nowDate = new Date();
  nowDate.setMonth(nowDate.getMonth() - 1);
  let nowYyyyMm = nowDate.toISOString().slice(0, 7).replace(/-/g, "");

  //yyyy 가 현재년도 인지 체크
  let nowYearFlag = yyyy === new Date().getFullYear().toString() ? "Y" : "N";

  let query = "/*getAnnualProfit*/";
  let queryParams = [];

  query += `
    SELECT
        (SELECT IFNULL(SUM(ts.total_sales),0)
          FROM tb_sales ts
          WHERE SUBSTRING(ts.sales_date, 1, 4) = ?`;

  queryParams.push(yyyy);

  if (business_id && business_id !== "all") {
    query += " AND ts.business_id = ?";
    queryParams.push(business_id);
  }

  query += `) -
        (SELECT IFNULL(SUM(tp.total_amount),0)
          FROM tb_purchase tp
          WHERE DATE_FORMAT(tp.issue_date, '%Y') = ?`;

  queryParams.push(yyyy);

  if (business_id && business_id !== "all") {
    query += " AND tp.business_id = ?";
    queryParams.push(business_id);
  }

  query += `) AS profit
    FROM dual;
  `;

  console.log(connection.format(query, queryParams));
  connection.query(query, queryParams, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch annual profit: ", error);
      return callback(error);
    }
    //salesProfitModel
    const annualProfit = results.map(
      (row) => new salesProfitModel(yyyy, row.profit)
    );
    callback(null, annualProfit);
  });
}

//사업자별 업체 월별 매출액 조회
function getMonthlySalesByVendor(params, callback) {
  let { business_id, yyyy, mm } = params;
  //현재 월로부터 12개월 전까지의 월별 매출을 조회

  let date = yyyy + mm;
  let lastYear = (parseInt(yyyy) - 1).toString() + mm;

  let query = "/*getMonthlySalesByVendor*/";
  query += `
          SELECT
            (SELECT business_name FROM tb_business WHERE business_id = tv.business_id) business_name,
            tv.business_id,
            tv.vendor_name,
            COALESCE(SUM(CASE WHEN ts.sales_date = ? THEN ts.total_sales ELSE 0 END), 0) AS total_sales,
            (COALESCE(SUM(CASE WHEN ts.sales_date = ? THEN ts.total_sales ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN ts.sales_date = ? THEN ts.total_sales ELSE 0 END), 0)) / COALESCE(SUM(CASE WHEN ts.sales_date = ? THEN ts.total_sales ELSE 0 END), 1)
             AS sales_growth_rate
          FROM
            tb_vendor tv
          LEFT OUTER JOIN
            tb_sales ts	ON ts.vendor_id = tv.vendor_id  
                        AND ts.business_id = tv.business_id 
          WHERE tv.business_id = ?
          GROUP BY
            tv.business_id, tv.vendor_id, tv.vendor_name
  `;

  let queryParams = [date, date, lastYear, lastYear, business_id];
  console.log(connection.format(query, queryParams));
  connection.query(query, queryParams, (error, results) => {
    if (error) {
      console.log("Query error: ", query);
      console.error("Failed to fetch monthly sales: ", error);
      return callback(error);
    }

    // 월매출 데이터를 salesModel 객체로 변환
    const salesVendor = results.map(
      (row) =>
        new salesVendorModel(
          row.business_name,
          row.business_id,
          row.vendor_name,
          yyyy + "-" + mm,
          row.total_sales,
          row.sales_growth_rate
        )
    );
    callback(null, salesVendor);
  });
}

module.exports = {
  getSales,
  checkVendorExists,
  checkProductExists,
  checkPaymentExists,
  checkBusinessExists,
  createSales,
  updateSales,
  deleteSales,
  getMonthlySales,
  getMonthlySalesByBusiness,
  getAnnualSales,
  getAnnualProfit,
  getMonthlySalesByVendor,
  getVendorMonthlySales,
};
