import { Mentions, Button, Tag } from "antd";
import debounce from "lodash/debounce";
import { useEffect } from "react";
import { useCallback, useRef, useState } from "react";
import { member } from "../../middleware";
const { Option } = Mentions;

const Member = () => {
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([
		{
			key: "No Result",
			value: "No Result",
			label: "No Result",
			disabled: true,
		},
	]);
	const ref = useRef();
	const [showMemberArea, setShowMemberArea] = useState(false);

	useEffect(() => {
		if (users[0].key !== "No Result") {
			setShowMemberArea(true);
		}
	}, [users]);

	const loadGithubUsers = async (key) => {
		if (!key) {
			setUsers([
				{
					key: "No Result",
					value: "No Result",
					label: "No Result",
					disabled: true,
				},
			]);
			return;
		}
		const {
			data: { accounts },
		} = await member(key);
		console.log(accounts);
		if (ref.current !== key) return;
		setLoading(false);
		setUsers(
			accounts.length !== 0
				? accounts.slice(0, 10).map((m) => ({
						key: m.username,
						value: m.username,
						label: m.username,
				  }))
				: [
						{
							key: "No Result",
							value: "No Result",
							label: "No Result",
							disabled: true,
						},
				  ]
		);
	};

	const debounceLoadGithubUsers = useCallback(
		debounce(loadGithubUsers, 800),
		[]
	);

	const onSearch = (search) => {
		console.log("Search:", search);
		ref.current = search;
		setLoading(!!search);
		setUsers([
			{
				key: "No Result",
				value: "No Result",
				label: "No Result",
				disabled: true,
			},
		]);
		debounceLoadGithubUsers(search);
	};
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
			<div style={{ display: "flex", flexDirection: "row" }}>
				<Mentions
					style={{
						width: "350px",
					}}
					loading={loading}
					onSearch={onSearch}
					options={users}
				/>
				<Button
					style={{ background: "#5A8EA4", color: "white", marginLeft: "10px" }}
				>
					+
				</Button>
			</div>
			{showMemberArea && (
				<div style={{ width: "400px" }}>
					{users[0].key !== "No Result" &&
						users.map((item) => <Tag closable>{item}</Tag>)}
				</div>
			)}
		</div>
	);
};

export default Member;
