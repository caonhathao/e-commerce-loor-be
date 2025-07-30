const systemNotify = {
    PENDING: {
        user_content: {
            title: "Bạn vừa tạo đơn hàng mới",
            content: "Đơn hàng của bạn đã được tạo với mã là ${id} và đang chờ nhà bán hàng xác nhận!",
            type: "NOTICE"
        },
        vendor_content: {
            title: "Bạn có đơn hàng mới",
            content: "Chúc mừng! Bạn vừa nhận được 1 đơn hàng có mã là ${id}. Hãy kiểm tra ngay.",
            type: "NOTICE"
        }
    },
    CONFIRMED: {
        user_content: {
            title: "Đơn hàng đã được xác nhận",
            content: "Đơn hàng ${id} của bạn đã được nhà bán hàng xác nhận. Vui lòng chờ xử lý tiếp theo.",
            type: "NOTICE"
        },
        vendor_content: {
            title: "Bạn đã xác nhận một đơn hàng",
            content: "Đơn hàng ${id} đã được xác nhận. Hãy tiến hành đóng gói hàng hóa.",
            type: "NOTICE"
        }
    },
    PREPARING: {
        user_content: {
            title: "Đơn hàng đang được chuẩn bị",
            content: "Đơn hàng ${id} của bạn đang được nhà bán hàng chuẩn bị.",
            type: "NOTICE"
        },
        vendor_content: {
            title: "Đơn hàng đang được chuẩn bị",
            content: "Bạn đang chuẩn bị đơn hàng ${id}. Hãy đảm bảo đúng sản phẩm và chất lượng.",
            type: "NOTICE"
        }
    },
    DELIVERING: {
        user_content: {
            title: "Đơn hàng đang được giao",
            content: "Đơn hàng ${id} của bạn đang được vận chuyển đến địa chỉ nhận.",
            type: "NOTICE"
        },
        vendor_content: {
            title: "Đơn hàng đang được giao",
            content: "Đơn hàng ${id} đã được chuyển cho đơn vị vận chuyển.",
            type: "NOTICE"
        }
    },
    CANCELED: {
        user_content: {
            title: "Đơn hàng đã bị huỷ",
            content: "Đơn hàng ${id} của bạn đã bị huỷ. Nếu có thắc mắc, vui lòng liên hệ hỗ trợ.",
            type: "WARNING"
        },
        vendor_content: {
            title: "Đơn hàng đã bị huỷ",
            content: "Đơn hàng ${id} đã bị người mua huỷ.",
            type: "WARNING"
        }
    },
    ABORTED: {
        user_content: {
            title: "Đơn hàng bị huỷ bởi hệ thống",
            content: "Đơn hàng ${id} đã bị huỷ do sự cố hệ thống hoặc vi phạm chính sách.",
            type: "ERROR"
        },
        vendor_content: {
            title: "Đơn hàng bị huỷ",
            content: "Đơn hàng ${id} đã bị hệ thống huỷ bỏ. Vui lòng kiểm tra lý do cụ thể.",
            type: "ERROR"
        }
    },
    POSTPONED: {
        user_content: {
            title: "Đơn hàng đã bị hoãn",
            content: "Đơn hàng ${id} của bạn đã bị hoãn lại. Chúng tôi sẽ cập nhật khi có thông tin mới.",
            type: "INFO"
        },
        vendor_content: {
            title: "Đơn hàng đã bị hoãn",
            content: "Đơn hàng ${id} đã bị hoãn do điều kiện phát sinh.",
            type: "INFO"
        }
    },
    REFUNDED: {
        user_content: {
            title: "Đơn hàng đã được hoàn tiền",
            content: "Bạn đã được hoàn tiền cho đơn hàng ${id}. Số tiền sẽ sớm được chuyển về tài khoản.",
            type: "NOTICE"
        },
        vendor_content: {
            title: "Đơn hàng đã hoàn tiền",
            content: "Bạn đã hoàn tiền cho đơn hàng ${id}.",
            type: "NOTICE"
        }
    },
    COMPLETE: {
        user_content: {
            title: "Đơn hàng đã hoàn tất",
            content: "Đơn hàng ${id} của bạn đã hoàn tất. Cảm ơn bạn đã mua sắm tại hệ thống.",
            type: "SUCCESS"
        },
        vendor_content: {
            title: "Đơn hàng đã hoàn tất",
            content: "Đơn hàng ${id} đã được giao thành công và hoàn tất.",
            type: "SUCCESS"
        }
    }
};
module.exports = systemNotify;