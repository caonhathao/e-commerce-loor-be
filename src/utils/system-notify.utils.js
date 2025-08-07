const systemNotify = {
    PENDING: {
        user_content: {
            title: "Bạn vừa tạo đơn hàng mới",
            content: "Đơn hàng của bạn đã được tạo với mã là ${id} và đang chờ nhà bán hàng xác nhận!",
            type: "NOTICE",
            redirect_url:"ORDER_DETAIL"
        },
        vendor_content: {
            title: "Bạn có đơn hàng mới",
            content: "Chúc mừng! Bạn vừa nhận được 1 đơn hàng có mã là ${id}. Hãy kiểm tra ngay.",
            type: "NOTICE",
            redirect_url:"ORDER_DETAIL"
        }
    },
    CONFIRMED: {
        user_content: {
            title: "Đơn hàng đã được xác nhận",
            content: "Đơn hàng ${id} của bạn đã được nhà bán hàng xác nhận. Vui lòng chờ xử lý tiếp theo.",
            type: "NOTICE",
            redirect_url:"ORDER_DETAIL"
        },
        vendor_content: {
            title: "Bạn đã xác nhận một đơn hàng",
            content: "Đơn hàng ${id} đã được xác nhận. Hãy tiến hành đóng gói hàng hóa.",
            type: "NOTICE",
            redirect_url:"ORDER_DETAIL"
        }
    },
    PACKING: {
        user_content: {
            title: "Đơn hàng đang được đóng gói",
            content: "Đơn hàng ${id} của bạn đang được đóng gói bởi nhà bán hàng.",
            type: "NOTICE",
            redirect_url:"ORDER_DETAIL"
        },
        vendor_content: {
            title: "Bạn đang đóng gói đơn hàng",
            content: "Hãy đảm bảo đơn hàng ${id} được đóng gói cẩn thận để giao đúng hẹn.",
            type: "NOTICE",
            redirect_url:"ORDER_DETAIL"
        }
    },
    WAITING_FOR_PICKUP: {
        user_content: {
            title: "Đơn hàng sắp được giao",
            content: "Đơn hàng ${id} của bạn đã sẵn sàng và đang chờ đơn vị vận chuyển đến lấy.",
            type: "INFO",
            redirect_url:"ORDER_DETAIL"
        },
        vendor_content: {
            title: "Chờ đơn vị vận chuyển",
            content: "Đơn hàng ${id} đang chờ đơn vị vận chuyển đến lấy hàng.",
            type: "INFO",
            redirect_url:"ORDER_DETAIL"
        }
    },
    SHIPPING: {
        user_content: {
            title: "Đơn hàng đang được vận chuyển",
            content: "Đơn hàng ${id} của bạn đang trên đường vận chuyển.",
            type: "NOTICE",
            redirect_url:"ORDER_DETAIL"
        },
        vendor_content: {
            title: "Đơn hàng đã rời kho",
            content: "Đơn hàng ${id} đã rời kho và đang được giao đến khách hàng.",
            type: "NOTICE",
            redirect_url:"ORDER_DETAIL"
        }
    },
    OUT_FOR_DELIVERY: {
        user_content: {
            title: "Đơn hàng sắp đến",
            content: "Đơn hàng ${id} của bạn đang trên xe giao hàng. Hãy chuẩn bị nhận hàng!",
            type: "INFO",
            redirect_url:"ORDER_DETAIL"
        },
        vendor_content: {
            title: "Đơn hàng đang được giao",
            content: "Đơn hàng ${id} đang được giao đến người mua.",
            type: "INFO",
            redirect_url:"ORDER_DETAIL"
        }
    },
    DELIVERED: {
        user_content: {
            title: "Đơn hàng đã được giao thành công",
            content: "Đơn hàng ${id} của bạn đã được giao đến nơi. Cảm ơn bạn đã mua sắm!",
            type: "SUCCESS",
            redirect_url:"ORDER_REVIEW"
        },
        vendor_content: {
            title: "Đơn hàng đã giao thành công",
            content: "Đơn hàng ${id} đã được giao đến khách hàng thành công.",
            type: "SUCCESS",
            redirect_url:"ORDER_REVIEW"
        }
    },
    RETURN_REQUESTED: {
        user_content: {
            title: "Bạn đã yêu cầu trả hàng",
            content: "Yêu cầu trả hàng cho đơn hàng ${id} đã được gửi. Chúng tôi sẽ xử lý sớm nhất.",
            type: "WARNING",
            redirect_url:"ORDER_DETAIL"
        },
        vendor_content: {
            title: "Khách hàng yêu cầu trả hàng",
            content: "Đơn hàng ${id} đã có yêu cầu trả hàng từ khách hàng.",
            type: "WARNING",
            redirect_url:"ORDER_DETAIL"
        }
    },
    RETURNED: {
        user_content: {
            title: "Đơn hàng đã được trả lại",
            content: "Đơn hàng ${id} đã được trả lại thành công. Cảm ơn bạn đã sử dụng dịch vụ.",
            type: "NOTICE",
            redirect_url:"ORDER_DETAIL"
        },
        vendor_content: {
            title: "Đơn hàng đã được hoàn trả",
            content: "Đơn hàng ${id} đã được trả lại từ khách hàng.",
            type: "NOTICE",
            redirect_url:"ORDER_DETAIL"
        }
    },
    CANCELLED: {
        user_content: {
            title: "Đơn hàng đã bị huỷ",
            content: "Đơn hàng ${id} của bạn đã bị huỷ. Nếu có thắc mắc, vui lòng liên hệ hỗ trợ.",
            type: "WARNING",
            redirect_url:"ORDER_DETAIL"
        },
        vendor_content: {
            title: "Đơn hàng đã bị huỷ",
            content: "Đơn hàng ${id} đã bị người mua huỷ.",
            type: "WARNING",
            redirect_url:"ORDER_DETAIL"
        }
    },
    FAILED_DELIVERY: {
        user_content: {
            title: "Giao hàng thất bại",
            content: "Đơn hàng ${id} không thể giao thành công. Vui lòng kiểm tra lại thông tin giao hàng.",
            type: "ERROR",
            redirect_url:"ORDER_DETAIL"
        },
        vendor_content: {
            title: "Đơn hàng giao thất bại",
            content: "Đơn hàng ${id} đã không được giao thành công. Vui lòng liên hệ đơn vị vận chuyển.",
            type: "ERROR",
            redirect_url:"ORDER_DETAIL"
        }
    }
};

module.exports = systemNotify;
