import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const GroupCardMaterial = () => {
  const CardGroup = ({ onClick, children }) => {
    return (
      <Card
        sx={{ width: 353, height: 70, marginBottom: 0.5 }}
        onClick={onClick}
      >
        {children}
      </Card>
    );
  };

  const CarHeaderGroup = ({ avatar, title, subheader }) => {
    const ExpandMore = styled((props) => {
      const { expand, ...other } = props;
      return <IconButton {...other} />;
    })(({ theme, expand }) => ({}));

    return (
      <>
        <CardHeader
          avatar={avatar}
          title={title}
          subheader={subheader}
          action={
            <IconButton aria-label='settings'>
              <ExpandMoreIcon sx={{ transform: 'rotate(-90deg)' }} />
            </IconButton>
          }
        />
        <CardActions disableSpacing>
          <ExpandMore aria-label='show more'>
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
      </>
    );
  };

  return {
    CardGroup,
    CarHeaderGroup,
  };
};

export default GroupCardMaterial;
