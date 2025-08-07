module.exports.orderStatus = [
    {
        status_code: "PENDING",
        status_name: "Đang chờ",
        status_mean: "Chờ người bán xác nhận đơn hàng",
        status_color: "rgb(128,128,128)",
        priority_order: 1,
        authority: "ROLE_VENDOR"
    },
    {
        status_code: "CONFIRMED",
        status_name: "Đã xác nhận",
        status_mean: "Người bán đã xác nhận đơn hàng",
        status_color: "rgb(30,144,255)",
        priority_order: 2,
        authority: "ROLE_VENDOR"
    },
    {
        status_code: "PACKING",
        status_name: "Đang đóng gói",
        status_mean: "Đang đóng gói đơn hàng",
        status_color: "rgb(30,144,255)",
        priority_order: 3,
        authority: "ROLE_VENDOR"
    },
    {
        status_code: "WAITING_FOR_PICKUP",
        status_name: "Chờ vận chuyển",
        status_mean: "Chờ đơn vị vận chuyển đến lấy hàng",
        status_color: "rgb(255,215,0)",
        priority_order: 4,
        authority: "ROLE_VENDOR"
    },
    {
        status_code: "SHIPPING_DELAYED",
        status_name: "Hoãn vận chuyển",
        status_mean: "Đang tạm hoãn giao hàng do sự cố hoặc yêu cầu",
        status_color: "rgb(255,165,0)",
        priority_order: 5,
        authority: "ROLE_SHIPPER"
    },
    {
        status_code: "SHIPPING",
        status_name: "Đang vận chuyển",
        status_mean: "Đơn hàng đang được vận chuyển",
        status_color: "rgb(255,140,0)",
        priority_order: 6,
        authority: "ROLE_SHIPPER"
    },
    {
        status_code: "OUT_FOR_DELIVERY",
        status_name: "Đang giao hàng",
        status_mean: "Đơn hàng đang được giao đến khách hàng",
        status_color: "rgb(255,140,0)",
        priority_order: 7,
        authority: "ROLE_SHIPPER"
    },
    {
        status_code: "DELIVERED",
        status_name: "Giao thành công",
        status_mean: "Đơn hàng đã giao thành công",
        status_color: "rgb(0,128,0)",
        priority_order: 8,
        authority: "ROLE_SHIPPER"
    },
    {
        status_code: "COMPLETE",
        status_name: "Thanh toán thành công",
        status_mean: "Giao dịch hoàn tất",
        status_color: "rgb(34,139,34)",
        priority_order: 9,
        authority: "ROLE_USER"
    },
    {
        status_code: "RETURN_REQUESTED",
        status_name: "Trả hàng",
        status_mean: "Người dùng yêu cầu trả hàng",
        status_color: "rgb(255,223,0)",
        priority_order: 10,
        authority: "ROLE_USER"
    },
    {
        status_code: "RETURNED",
        status_name: "Đã trả hàng",
        status_mean: "Đơn hàng đã được trả lại",
        status_color: "rgb(128,0,128)",
        priority_order: 11,
        authority: "ROLE_VENDOR"
    },
    {
        status_code: "CANCELLED",
        status_name: "Đơn hàng bị hủy",
        status_mean: "Đơn hàng đã bị huỷ",
        status_color: "rgb(220,20,60)",
        priority_order: 98,
        authority: "ROLE_SYSTEM"
    },
    {
        status_code: "FAILED_DELIVERY",
        status_name: "Giao hàng thất bại",
        status_mean: "Giao hàng không thành công",
        status_color: "rgb(178,34,34)",
        priority_order: 99,
        authority: "ROLE_SHIPPER"
    }
]
