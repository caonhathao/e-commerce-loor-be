// Ví dụ: GET /api/products?page=2&limit=10

const getPaginatedProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;         // Mặc định là page 1
    const limit = parseInt(req.query.limit) || 10;      // Mặc định 10 item / page
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await Product.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']], // Tuỳ ý sắp xếp
            include: [Category, Brand]      // Tuỳ bạn muốn include gì
        });

        return res.json({
            currentPage: page,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            products: rows
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
