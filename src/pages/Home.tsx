import { Box, Typography, Button, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Home() {
	const navbarHeight = 64; // 根据你的 Navbar 高度调整
	const bannerHeight = 48;

	return (
		<>
			{/* 页面主内容：为避免被 Navbar 与 banner 遮挡，增加顶部内边距 */}
			<Box sx={{ pt: `${navbarHeight + bannerHeight + 16}px`, px: 2 }}>
				<Box sx={{ maxWidth: 1200, mx: "auto" }}>
					<Typography id="home-header" variant="h3" gutterBottom>
						欢迎来到 HRPAuth
					</Typography>

					<Typography variant="body1" paragraph>
						这是示例主页。下方展示一些示例卡片与条目，演示页面布局与可导航的 header。
					</Typography>

					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
							gap: 2,
						}}
					>
						{[1, 2, 3].map((i) => (
							<Box key={i}>
								<Paper sx={{ p: 2 }}>
									<Typography variant="h6">示例卡片 {i}</Typography>
									<Typography variant="body2" paragraph>
										这是一段示例说明文字，用于展示卡片布局与按钮行为。
									</Typography>
									<Button variant="contained" component={RouterLink} to="/about">
										了解更多
									</Button>
								</Paper>
							</Box>
						))}
					</Box>

					<Box sx={{ mt: 4 }}>
						<Typography variant="h5" gutterBottom>
							更多内容示例
						</Typography>

						{[...Array(6)].map((_, idx) => (
							<Paper key={idx} sx={{ p: 2, mb: 2 }}>
								<Typography variant="subtitle1">示例条目 {idx + 1}</Typography>
								<Typography variant="body2">示例文本，说明该条目的用途与内容。</Typography>
							</Paper>
						))}
					</Box>
				</Box>
			</Box>
		</>
	);
}

