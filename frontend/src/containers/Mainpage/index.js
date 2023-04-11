import styled from "styled-components";
import {
	Input,
	Button,
	DatePicker,
	TimePicker,
	Switch,
	Modal,
	Form,
} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import "../../css/Background.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useMeet } from "../hooks/useMeet";
import moment from "moment";
import * as AXIOS from "../../middleware";
import Member from "./Member";
import { Header } from "../../components/Header";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const JoinMeet = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	flex-direction: column;
	width: 310px;
	left: 10%;
	top: 20%;
	// transform: translate(-50%, 0);
	row-gap: 20px;
`;

const CreateMeet = styled.div`
	width: fit-content;
	min-width: 300px;
	min-height: 400px;
	position: relative;
	left: 10%;
	top: 20%;
	// top: 180px;
	// transform: translate(-50%, -50%);
	// border: 1px solid #D8D8D8;
	// padding: 5% 10%;
`;

// const CreateContent = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   row-gap: 10px;
// `;

const Mainpage = () => {
	const [votingButton, setVotingButton] = useState("hidden");
	const [meetData, setMeetData] = useState({
		meet_name: "",
		start_date: "",
		end_date: "",
		start_time_slot_id: 0,
		end_time_slot_id: 0,
		gen_meet_url: false,
		description: "",
		member_ids: [],
		emails: [],
	});
	const { login, cookies } = useMeet();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();
	const invite = useRef(null);
	const [form] = Form.useForm();

	const handleLogin = () => {
		navigate("/login");
	};

	const showDate = (e) => {
		if (votingButton === "hidden") {
			setVotingButton("visible");
		} else {
			setVotingButton("hidden");
		}
	};

	const handleInvite = async (e) => {
		if (e?.key === "Enter" || !e.key) {
			if (cookies.token) {
				const { data, error } = await AXIOS.joinMeet(
					{ invite_code: invite.current.input.value },
					cookies.token
				);
				// console.log(result);
				navigate(`/meets/${data.id}`, {
					state: {
						meetInfo: {
							EventName: data.meet_name,
							Date:
								data.start_date.replaceAll("-", "/") +
								"~" +
								data.end_date.replaceAll("-", "/"),
							Time: slotIDProcessing(
								data.start_time_slot_id,
								data.end_time_slot_id
							), //  (data.start_time_slot_id - 1) * 30 % 60
							Host: data.host_info?.name ?? data.host_info?.id ?? "Guest",
							Memeber: data.member_infos,
							Description: data.description,
							"Voting Deadline": data.voting_end_time
								? moment(data.voting_end_time).format("YYYY/MM/DD HH:mm:ss")
								: "not assigned",
							"Invitation URL": data.invite_code,
							"Google Meet URL": data.meet_url ?? "temp",
						},
					},
				});
			}
		}
	};

	const handleMeetDataChange =
		(func, ...name) =>
		(e) => {
			if (name.length === 1) {
				setMeetData((prev) => ({ ...prev, [name[0]]: func(e) }));
			} else {
				setMeetData((prev) => ({
					...prev,
					[name[0]]: func(e[0], 1),
					[name[1]]: func(e[1], 0),
				}));
			}
		};

	const slotIDProcessing = (start, end) => {
		let hour = String(parseInt(((start - 1) * 30) / 60));
		const startHour = "0".repeat(2 - hour.length) + hour;
		const startMinute = parseInt(((start - 1) * 30) % 60) ? "30" : "00";
		hour = String(parseInt((end * 30) / 60));
		const endHour = "0".repeat(2 - hour.length) + hour;
		const endMinute = parseInt((end * 30) % 60) ? "30" : "00";
		return `${startHour}:${startMinute}~${endHour}:${endMinute}`;
	};

	const handleMeetCreate = async () => {
		try {
			if (!login) {
				setIsModalOpen(true);
				return;
			}
			const { data } = await AXIOS.addMeet(
				{
					...meetData,
					voting_end_time: moment(
						meetData.voting_end_date + " " + meetData.voting_end_time,
						"YYYY-MM-DD HH-mm-ss"
					).toISOString(),
				},
				cookies.token
			);
			navigate(`/meets/${data.id}`, {
				state: {
					meetInfo: {
						EventName: data.meet_name,
						Date:
							data.start_date.replaceAll("-", "/") +
							"~" +
							data.end_date.replaceAll("-", "/"),
						Time: slotIDProcessing(
							data.start_time_slot_id,
							data.end_time_slot_id
						), //  (data.start_time_slot_id - 1) * 30 % 60
						Host: data.host_info.name ?? data.host_info.id,
						Memeber: data.member_infos,
						Description: data.description,
						"Voting Deadline": data.voting_end_time
							? moment(data.voting_end_time).format("YYYY/MM/DD HH:mm:ss")
							: "not assigned",
						"Invitation URL": data.invite_code,
						"Google Meet URL": data.meet_url ?? "temp",
					},
				},
			});
		} catch (e) {
			console.log(e);
		}
	};

	const handleOk = async () => {
		// 你這邊再加上ok後要做的動作
		try {
			if (!form.getFieldValue().name) return;
			const { data } = await AXIOS.addMeet(
				{
					...meetData,
					guest_name: form.getFieldValue().name,
					voting_end_time: moment(
						meetData.voting_end_date + " " + meetData.voting_end_time,
						"YYYY-MM-DD HH-mm-ss"
					).toISOString(),
				},
				cookies.token
			);
			console.log(data.id);
			navigate(`/meets/${data.id}`, {
				state: {
					meetInfo: {
						EventName: data.meet_name,
						Date:
							data.start_date.replaceAll("-", "/") +
							"~" +
							data.end_date.replaceAll("-", "/"),
						Time: slotIDProcessing(
							data.start_time_slot_id,
							data.end_time_slot_id
						), //  (data.start_time_slot_id - 1) * 30 % 60
						Host: data.host_info.name ?? data.host_info.id,
						Memeber: data.member_infos,
						Description: data.description,
						"Voting Deadline": data.voting_end_time
							? moment(data.voting_end_time).format("YYYY/MM/DD HH:mm:ss")
							: "not assigned",
						"Invitation URL": data.invite_code,
						"Google Meet URL": data.meet_url ?? "temp",
					},
				},
			});
		} catch (error) {
			console.log(error);
		}
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const CONTENTMENU = {
		"Meet Name*": (
			<Input
				style={{ borderRadius: "5px", width: "350px" }}
				onChange={handleMeetDataChange((i) => i.target.value, "meet_name")}
			/>
		),
		"Start/End Date*": (
			<RangePicker
				style={{ width: "350px" }}
				onChange={handleMeetDataChange(
					(i) => moment(i.toISOString()).format("YYYY-MM-DD"),
					"start_date",
					"end_date"
				)}
			/>
		),
		"Start/End Time*": (
			<TimePicker.RangePicker
				style={{ width: "350px" }}
				onChange={handleMeetDataChange(
					(i, plus) => (i.hour() * 60 + i.minute()) / 30 + plus,
					"start_time_slot_id",
					"end_time_slot_id"
				)}
				minuteStep={30}
				format={"HH:mm"}
			/>
		),
		Member: <Member style={{ borderRadius: "5px" }} />,
		Description: (
			<TextArea
				style={{
					height: "120px",
					width: "400px",
				}}
				onChange={handleMeetDataChange((i) => i.target.value, "description")}
			/>
		),
		"Voting Deadline": (
			<div style={{ columnGap: "10%" }}>
				<Switch onChange={showDate} />
				<DatePicker
					style={{ visibility: votingButton }}
					onChange={handleMeetDataChange(
						(i) => moment(i.toISOString()).format("YYYY-MM-DD"),
						"voting_end_date"
					)}
				/>
				<TimePicker
					style={{ visibility: votingButton }}
					// name="Voting Deadline Time"
					onChange={handleMeetDataChange(
						(i) => moment(i.toISOString()).format("HH-mm-ss"),
						"voting_end_time"
					)}
				/>
			</div>
		),
		"Google Meet URL": (
			<Switch
				disabled={!login}
				onChange={handleMeetDataChange((i) => i, "gen_meet_url")}
			/>
		),
	};

	return (
		<>
			{login && <Header />}
			<div className="leftContainer">
				<JoinMeet>
					<div
						style={{
							fontStyle: "normal",
							fontWeight: 500,
							fontSize: "30px",
							lineHeight: "40px",
						}}
					>
						Join Meet
					</div>
					<div
						style={{ display: "flex", alignItems: "center", columnGap: "10px" }}
					>
						<Input
							placeholder="Invitation code"
							style={{
								width: "250px",
								height: "45px",
								borderRadius: "15px",
							}}
							ref={invite}
							onKeyDown={handleInvite}
						/>
						<Button
							type="primary"
							icon={<ArrowRightOutlined />}
							size={"large"}
							style={{
								background: "#FFD466",
							}}
							onClick={handleInvite}
						/>
					</div>
				</JoinMeet>
				<p className="title">Let's Meet!</p>
			</div>
			<div className="rightContainer">
				{!login && (
					<Button
						style={{
							gridColumn: "2/3",
							float: "right",
							marginRight: "5%",
							top: "3%",
							borderRadius: "15px",
							borderColor: "#FFA601",
							color: "#FFA601",
						}}
						onClick={handleLogin}
					>
						Login
					</Button>
				)}
				<CreateMeet>
					<div
						style={{
							// top: 0,
							// left: 0,
							fontStyle: "normal",
							fontWeight: "500",
							fontSize: "30px",
							lineHeight: "40px",
							color: "#000000",
							marginBottom: "30px",
						}}
					>
						Create Meet
					</div>
					<div
						style={{ display: "flex", flexDirection: "column", rowGap: "20px" }}
					>
						{Object.keys(CONTENTMENU).map((c, index) => (
							<div
								key={index}
								style={{
									display: "flex",
									alignItems: "center",
									// columnGap: "10%",
									justifyContent: "flex-start",
								}}
							>
								<div style={{ width: "200px" }}>{c}</div>
								{CONTENTMENU[c]}
							</div>
						))}
						<div style={{ display: "flex", justifyContent: "flex-end" }}>
							<Button
								style={{
									top: "30px",
									borderRadius: "15px",
									background: "#B3DEE5",
								}}
								size="large"
								onClick={handleMeetCreate}
							>
								Create
							</Button>
						</div>
					</div>
				</CreateMeet>
				<Modal
					title=""
					open={isModalOpen}
					onOk={handleOk}
					onCancel={handleCancel}
					okText="Ok"
					cancelText="Cancel"
				>
					<Form form={form} layout="vertical" name="form_in_modal">
						<Form.Item
							name="name"
							label="Please enter your name"
							rules={[
								{
									required: true,
									message: "Error: Please enter your name!",
								},
							]}
						>
							<Input />
						</Form.Item>
					</Form>
				</Modal>
			</div>
		</>
	);
};

export default Mainpage;
