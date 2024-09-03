import React from 'react'
import { Dialog, DialogTitle, DialogContent} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../../theme';
import { useTranslation } from 'react-i18next';
import EditItemForm from './EditItemForm';

const EditItemDialog = ({open, onClose, itemId, customFields}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t } = useTranslation();

  return (
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ color: colors.greenAccent[600], fontSize: 20 }}> {t('editItemDetails')}</DialogTitle>
                <DialogContent>
                    {editItemId && <EditItemForm itemId={editItemId} onClose={handleDialogClose} customFields={customFields.filter(field => collection.Items.some(item => item[field.field] !== null && item[field.field] !== undefined))} />}
                </DialogContent>
            </Dialog>
  )
}

export default EditItemDialog
