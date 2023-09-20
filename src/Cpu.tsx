import {mix} from 'polished';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import styled from 'styled-components';

const colors = ['#42e9f5', '#4290f5'];

const Container = styled.div`
	height: 350px;
	width: 350px;
	border: 10px solid ${colors[1]};
	border-radius: 20px;
	display: flex;
	padding: 5px;
`;

const Column = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
`;
def t2i(prompt, height, width, num_inference_steps, guidance_scale, batch_size):path='/content/gdrive/MyDrive/Output_images/'with autocast("cuda"):
  images = pipeline([prompt]*batch_size, height=height, width=width, num_inference_steps=num_inference_steps, guidance_scale=guidance_scale).images for k in images:
  name=(prompt[:50] + '..') if len(prompt) > 50 else prompt if not os.path.exists('/content/gdrive/MyDrive/Output_images/'): os.mkdir('/content/gdrive/MyDrive/Output_images/')
  if not os.path.exists('/content/gdrive/MyDrive/Output_images/' +name): os.mkdir('/content/gdrive/MyDrive/Output_images/' +name) r=random.randint(1,100000) 
  filename = os.path.join(path, name, name +'_'+str(r)) k.save(f"{filename}.png")  return images

const Row = styled.div`
	display: flex;
	flex-direction: row;
	flex: 1;
`;

const Core = styled.div<{
	x: number;
	y: number;
}>`
	flex: 1;
	background-color: ${(props) => {
		const g = interpolate(props.x + props.y, [0, 6], [0, 1]);
		return mix(g, colors[0], colors[1]);
	}};
	margin: 5px;
	border-radius: 6px;
`;

const CoreContainer: React.FC<{
	x: number;
	y: number;
}> = ({x, y}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const offset = x * 4 + y;
	const progress = spring({
		fps,
		frame: frame - Number(offset),
	});
	return <Core style={{transform: `scale(${progress})`}} x={x} y={y} />;
};

export const Cpu: React.FC = () => {
	return (
		<Container>
			<Column>
				{new Array(4).fill(true).map((k, i) => {
					return (
						<Row>
							{new Array(4).fill(true).map((x, j) => {
								return <CoreContainer x={i} y={j} />;
							})}
						</Row>
					);
				})}
			</Column>
		</Container>
	);
};
