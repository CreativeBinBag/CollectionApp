import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import { tokens } from '../../../theme';
import { Box, Button, Card, Typography, Avatar, Stack, useTheme, Dialog, DialogTitle, DialogContent } from '@mui/material';
import Header from '../../components/Header';
import { DataGrid } from '@mui/x-data-grid';
import Visibility from '@mui/icons-material/Visibility';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import EditItemForm from './EditItemForm';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';

const ViewCollection = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { id } = useParams();
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [collection, setCollection] = useState(null);
    const [editItemId, setEditItemId] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemDetails, setItemDetails] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    useEffect(() => {
        api.get(`/api/collections/${id}/view`)
            .then(response => {
                setCollection(response.data);
            })
            .catch(error => console.error('Error fetching collection:', error));
    }, [id]);

    
    const handleAction = (itemId, action) => {
        if (action === 'view') {
            // fetch item details and open the view dialog
            api.get(`/api/items/${itemId}/get`)
                .then(response => {
                    setItemDetails(response.data);
                    setViewDialogOpen(true);
                })
                .catch(error => console.error('Error fetching item details:', error));
        } else if (action === 'edit') {
            setEditItemId(itemId);
            setDialogOpen(true);
        } else if (action === 'delete') {
            setItemToDelete(itemId);
            setDeleteDialogOpen(true);
        }
    };



    const handleDeleteConfirm = () => {
        api.delete(`/api/items/${itemToDelete}/delete`)
            .then(() => {
                setCollection(prevState => ({
                    ...prevState,
                    Items: prevState.Items.filter(item => item.id !== itemToDelete),
                }));
                setDeleteDialogOpen(false);
            })
            .catch(error => console.error('Error deleting item:', error));
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditItemId(null);
    };

    if (!collection) {
        return <Typography>Loading...</Typography>;
    }    

    
    // Get custom fields from collection model
    const customFields = [
        { field: 'custom_int1_value', state: collection.custom_int1_state, headerName: collection.custom_int1_name },
        { field: 'custom_int2_value', state: collection.custom_int2_state, headerName: collection.custom_int2_name },
        { field: 'custom_int3_value', state: collection.custom_int3_state, headerName: collection.custom_int3_name },
        { field: 'custom_string1_value', state: collection.custom_string1_state, headerName: collection.custom_string1_name },
        { field: 'custom_string2_value', state: collection.custom_string2_state, headerName: collection.custom_string2_name },
        { field: 'custom_string3_value', state: collection.custom_string3_state, headerName: collection.custom_string3_name },
        { field: 'custom_text1_value', state: collection.custom_text1_state, headerName: collection.custom_text1_name },
        { field: 'custom_text2_value', state: collection.custom_text2_state, headerName: collection.custom_text2_name },
        { field: 'custom_text3_value', state: collection.custom_text3_state, headerName: collection.custom_text3_name },
        { field: 'custom_bool1_value', state: collection.custom_bool1_state, headerName: collection.custom_bool1_name },
        { field: 'custom_bool2_value', state: collection.custom_bool2_state, headerName: collection.custom_bool2_name },
        { field: 'custom_bool3_value', state: collection.custom_bool3_state, headerName: collection.custom_bool3_name },
        { field: 'custom_date1_value', state: collection.custom_date1_state, headerName: collection.custom_date1_name },
        { field: 'custom_date2_value', state: collection.custom_date2_state, headerName: collection.custom_date2_name },
        { field: 'custom_date3_value', state: collection.custom_date3_state, headerName: collection.custom_date3_name }
    ];

    console.log(customFields);
    const columns = [
        { field: 'name', headerName: t('name'),  flex: 1, minWidth: 150 , disableReorder: true },
           ...customFields
        .filter(field => field.headerName != null && field.state !== "NOT_PRESENT")  // Filter out invalid fields
        .reduce((unique, field) => {  // Reduce to remove duplicates
            if (!unique.some(item => item.headerName === field.headerName)) {
                unique.push({
                    field: field.field,
                    headerName: field.headerName || field.field.replace(/_/g, ' '),
                    flex: 1, 
                    minWidth: 150,
                    disableReorder: true
                });
            }
            return unique;
        }, []),
        {
            field: 'actions',
            headerName: t('actions'),
            headerAlign: 'center',
            align: 'center',
            flex: 1, 
            minWidth: 150,
            disableReorder: true,
            renderCell: (params) => (
                <Box>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            startIcon={<Visibility />}
                            onClick={() => handleAction(params.row.id, 'view')}
                        >
                            {t('view')}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<EditOutlinedIcon />}
                            onClick={() => handleAction(params.row.id, 'edit')}
                        >
                            {t('edit')}
                        </Button>
                        <Button
                            sx={{ backgroundColor: colors.redAccent[500] }}
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleAction(params.row.id, 'delete')}
                        >
                            {t('delete')}
                        </Button>

                    </Stack>
                </Box>
            ),
        },
    ];
  

    console.log('Columns:', columns);

 
    return (
        <Box sx={{ padding: 3 }}>
            <Button onClick={() => navigate('/manage-collections')} variant="contained" sx={{ mb: 2, backgroundColor: colors.greenAccent[700] }}>
                {t('back')}
            </Button>
            <Box display="flex" gap={1} mb={3}>
                <Card sx={{ padding: 1, width: 300, borderRadius: "10px" }}>
                    <Avatar src={collection?.imageUrl} sx={{ width: 100, height: 100 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: 20, mt: 2, color: colors.grey[100] }}>
                        {collection?.name}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2, color: colors.greenAccent[400] }}>
                        {collection?.categoryId}
                    </Typography>
                    <Box mb={1}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 14, color: colors.grey[500], lineHeight: 1.5 }}>
                        {t('description')} :
                        </Typography>
                        <ReactMarkdown children={collection?.description} remarkPlugins={[remarkGfm]} components={{ p: Typography, a: 'a', img: 'img' }} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 12, color: colors.greenAccent[200] }}>
                        {t('createdAt')}: {new Date(collection?.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 12, color: colors.greenAccent[200] }}>
                    {t('lastUpdated')}: {new Date(collection?.updatedAt).toLocaleString()}
                    </Typography>
                </Card>
                <Box flex={1} ml={5}>
                    <Header title= {t('collectionDetails')}subtitle={t('itemsCollectedBy', { name: collection?.User?.userName || t('theUser')})}
  />
                    <Box sx={{display: 'flex',
                            flexDirection: 'column',
                            height: '65vh',
                            overflowX: 'auto',
                            width: '100%',}}>
                        <DataGrid
                            rows={collection?.Items || []}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            
                            sx={{
                                '& .MuiDataGrid-columnSeparator': {
                                    display: 'none', // Hides column separators
                                  },
                                  '& .MuiDataGrid-columnHeaderDraggable': {
                                    pointerEvents: 'none', // Disables column dragging
                                  },
                                
                                '& .MuiDataGrid-columnHeaders': { backgroundColor: colors.blueAccent[700], borderBottom: "none", minWidth: 150,},
                                '& .MuiDataGrid-footerContainer': { backgroundColor: colors.blueAccent[700] },
                                '& .MuiDataGrid-virtualScroller': { backgroundColor: colors.primary[400] },
                               
                                }
 
                            }
                        />
                    </Box>
                </Box>
            </Box>

            {/* Edit Item Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ color: colors.greenAccent[600], fontSize: 20 }}> {t('editItemDetails')}</DialogTitle>
                <DialogContent>
                    {editItemId && <EditItemForm itemId={editItemId} onClose={handleDialogClose} customFields={customFields.filter(field => collection.Items.some(item => item[field.field] !== null && item[field.field] !== undefined))} />}
                </DialogContent>
            </Dialog>

            {/* View Item Dialog */}
            <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm"  PaperProps={{
                 sx: {
                       width: '400px', 
                       maxHeight: '100vh', 
                       borderRadius: '12px',
                       padding: '10px',
                    }
                   }}fullWidth>
                <DialogTitle sx={{ color: colors.greenAccent[600], fontSize: 20 }}>{t('itemDetails')}</DialogTitle>
                <DialogContent sx={{padding: '16px'}}>
                    {itemDetails && (
                        <Card sx={{ padding: 2, borderRadius: "10px", backgroundColor: colors.blueAccent[800] }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: 20 }}>
                                {itemDetails.name}
                            </Typography>
                            {customFields
                                .filter(field => itemDetails[field.field] !== null && itemDetails[field.field] !== undefined)
                                .map(field => (
                                    <Typography key={field.field} variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {field.headerName || field.field.replace(/_/g, ' ')}: {itemDetails[field.field]}
                                    </Typography>
                                ))}
                            {itemDetails.associatedTags && (
                                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {t('tags')}: {itemDetails?.associatedTags?.map(tag => tag.name).join(', ')}
                                </Typography>
                            )}
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {t('createdAt')}: {new Date(itemDetails?.createdAt).toLocaleString()}
                              
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {t('lastUpdated')}:  {new Date(itemDetails?.updatedAt).toLocaleString()}
                            </Typography>
                        </Card>
                    )}
                </DialogContent>
            </Dialog>
              

            
            {/* Confirm Delete Dialog */}
            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemName={itemToDelete ? collection?.Items.find(item => item.id === itemToDelete)?.name : ''}
            />
        </Box>
    );
};

export default ViewCollection;
