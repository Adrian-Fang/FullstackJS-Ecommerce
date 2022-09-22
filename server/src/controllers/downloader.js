const pool = require('../database/connection').pool;
const excel = require('exceljs')

module.exports = {
    downloadAllOrder: (req, res, next) => {
        
        let userId = req.userId;
        let orderQuery = `
                SELECT o.orderId, o.createdAt, r.productName, r.productQty, r.productPrice, o.subTotal, o.shipping, o.discount, o.paymentOption, 
                    CASE o.paymentStatus
                        WHEN 1 THEN 'To pay'
                        WHEN 2 THEN 'Partial paid'
                        WHEN 3 THEN 'Paid'
                        ELSE null
                    END AS paymentStatus,
                        CASE o.deliveryStatus
                        WHEN 1 THEN 'In process'
                        WHEN 2 THEN 'Delivered'
                        ELSE 'To process'
                    END AS deliveryStatus, 
                    o.deliveryCompany, o.deliveyTrackingId, o.deliveryTime
                FROM OMS_orders o LEFT JOIN OMS_order_product_relation r
                ON o.orderId = r.orderId
                where o.userId='${userId}' and o.orderStatus !=9 ORDER BY o.createdAt DESC;`;
        pool.query(orderQuery, (err, result) => {
            if(err) res.json({status: 0, msg: 'Error fetching order data', result: null})
            else {
                let workbook = new excel.Workbook();
                let worksheet = workbook.addWorksheet('My Orders');
                worksheet.columns = [
                    {header: 'Order No.', key: 'orderId', width: 20},
                    {header: 'Date', key:'createdAt', width: 15},
                    {header: 'Product', key:'productName', width: 30},
                    {header: 'Qty', key:'productQty', width: 5},
                    {header: 'Unit Price', key:'productPrice', width: 10},
                    {header: 'SubTotal', key:'subTotal', width: 10},
                    {header: 'Shipping', key:'shipping', width: 10},
                    {header: 'Discount', key:'discount', width: 10},
                    {header: 'Payment Option', key:'paymentOption', width: 20},
                    {header: 'Payment Status', key:'paymentStatus', width: 15},
                    {header: 'Delivery Status', key:'deliveryStatus', width: 15},
                    {header: 'Delivery Company', key:'deliveryCompany', width: 15},
                    {header: 'Delivery Tracking ID', key:'deliveryTrackingId', width: 20},
                    {header: 'Delivery Time', key:'deliveryTime', width: 15},
                ];
                worksheet.addRows(result);
                worksheet.autoFilter= 'A1:N1';
                worksheet.getRow(1).font = { bold: true };

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "My_Orders.xlsx")
                return workbook.xlsx.write(res).then(() => res.status(200).end());
            }
        })
    }
}