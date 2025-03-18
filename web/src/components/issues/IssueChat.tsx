"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  TextField, 
  Typography, 
  Avatar, 
  Paper, 
  IconButton,
  CircularProgress,
  Divider,
  Chip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { getIssueMessages, createIssueMessage } from '@/services/issueMessageService';
import { Issue, IssueMessage } from '@/types/issue';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type Role = 'admin' | 'store' | 'driver';

const roleColors: Record<Role, string> = {
  admin: '#3f51b5',
  store: '#f50057',
  driver: '#ff9800'
};

const roleNames = {
  admin: 'Administrator',
  store: 'Store',
  driver: 'Driver'
};

interface MessagesData {
  messages: IssueMessage[];
  total: number;
}

interface IssueProps {
  open: boolean;
  onClose: () => void;
  issue: Issue;
  userId: number;
}

interface Error {
  message: string;
}

interface User {
  id: number;
  user: {
    id: number;
  }
}


const IssueChat = ({ open, onClose, issue, userId }: IssueProps) => {
  const [message, setMessage] = useState('');
  const [fileIds, setFileIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch messages
  const [messagesData, setMessagesData] = useState<MessagesData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {user}= useSelector((state: RootState) => state.auth as {user: User | null});
    
  const [messageArray, setMessageArray] = useState<IssueMessage[]>([]);
  const [tempMessageId, setTempMessageId] = useState<number>(0);
  
  useEffect(() => {
    const fetchMessages = async () => {
      if (!issue?.id || !open) return;
      
      setIsLoading(true);
      try {
        const data = await getIssueMessages(issue.id);
        setMessagesData(data);
        setMessageArray(data.messages);
        setError(null);
      } catch (err: any) {
        setError({ message: err.message || 'An error occurred' });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [issue?.id, open]);

  const handleSendMessage = async () => {
    if (!message.trim() && fileIds.length === 0) return;
    
    // Lưu nội dung tin nhắn trước khi xóa khỏi input
    const messageContent = message.trim();
    
    // Xóa nội dung tin nhắn trong input ngay lập tức
    setMessage('');
    
    // Tạo ID tạm thời cho tin nhắn mới
    const newTempId = tempMessageId - 1; // Dùng số âm để tránh trùng với ID từ server
    setTempMessageId(newTempId);
    
    // Tạo đối tượng tin nhắn mới
    const newMessage: IssueMessage = {
      id: newTempId,
      issueId: issue.id,
      senderId: userId,
      message: messageContent,
    };
    
    // Thêm tin nhắn mới vào đầu mảng
    const updatedMessages = [newMessage, ...messageArray];
    setMessageArray(updatedMessages);
    
    console.log('Tin nhắn sau khi thêm:', updatedMessages); // Debug
    
    // Gọi API để lưu tin nhắn
    try {
      const response = await createIssueMessage({
        issueId: issue.id,
        message: messageContent,
        senderId: user?.user?.id || 0
      });
      
      console.log('API response:', response); // Debug
      
      // Nếu muốn cập nhật ID thực từ response
      // const realId = response.id;
      // setMessageArray(prev => prev.map(msg => 
      //   msg.id === newTempId ? { ...msg, id: realId } : msg
      // ));
    } catch (error) {
      console.error('Error sending message:', error);
      // Nếu gửi thất bại, xóa tin nhắn khỏi state
      setMessageArray(prev => prev.filter(msg => msg.id !== newTempId));
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (e: any) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Tao FormData de upload file
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      // Goi API upload file
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFileIds(prev => [...prev, ...data.fileIds]);
    } catch (error) {
      console.error('Error uploading files:', error);
      // Hien thi thong bao loi
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { height: '80vh' } }}
      sx={{
        '& .MuiDialog-paper': {
          width: '90%',
          maxWidth: '700px',
          margin: '0 auto',
        },
      }}
    >
      {issue && (
        <>
          <DialogTitle>
            <Box className="text-center" alignItems="center">
              <Typography variant="h6">
                Issue detail
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Order ID: #{issue.id} | Order: #{issue.order_id}
              </Typography>
            </Box>
            {issue?.issue_image_url && (
              <Box mt={1}>
                <Typography className="text-end" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {new Date(issue.created_at).toLocaleString('vi-VN')}
                </Typography>
                <Box 
                  component="img" 
                  src={issue?.issue_image_url} 
                  alt="Issue image"
                  sx={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'contain',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                />
              </Box>
            )}
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
            {/* Messages */}
            <Box sx={{ 
              flexGrow: 1, 
              overflowY: 'auto', 
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Typography color="error" align="center">
                  An error occurred while loading messages
                </Typography>
              ) : messageArray.length === 0 ? (
                <Box 
                  display="flex" 
                  justifyContent="center" 
                  alignItems="center" 
                  height="100%"
                  flexDirection="column"
                  gap={1}
                >
                  <Typography color="text.secondary">
                    No messages yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start a Chat
                  </Typography>
                </Box>
              ) : (
                <>
                  {messageArray.map((msg) => (
                    <Box 
                      key={`msg-${msg.id}`}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.senderId === userId ? 'flex-end' : 'flex-start',
                      }}
                    >
                        <Paper
                        id="4"
                        elevation={1}
                        sx={{ 
                            p: 1.5, 
                            maxWidth: '80%',
                            bgcolor: msg.senderId === userId ? 'primary.light' : 'background.paper',
                            color: msg.senderId === userId ? 'white' : 'inherit',
                            borderRadius: 2
                        }}
                        >
                        <Typography variant="body1">{msg.message}</Typography>
                        
                        {msg.fileIds && msg.fileIds.length > 0 && (
                            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {msg.fileIds.map((fileId, index) => (
                                <Button
                                key={index}
                                size="small"
                                variant="outlined"
                                href={`/api/files/${fileId}`}
                                target="_blank"
                                sx={{ 
                                    fontSize: '0.7rem',
                                    color: msg.senderId === userId ? 'white' : 'primary.main',
                                    borderColor: msg.senderId === userId ? 'white' : 'primary.main',
                                }}
                                >
                                File {index + 1}
                                </Button>
                            ))}
                            </Box>
                        )}
                        </Paper>
                    </Box>
                  ))}
                </>
              )}
            </Box>

            {/* Selected files */}
            {fileIds.length > 0 && (
              <Box sx={{ p: 1, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary">Attached files:</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                  {fileIds.map((fileId, index) => (
                    <Chip 
                      key={index}
                      label={`File ${index + 1}`}
                      size="small"
                      onDelete={() => setFileIds(prev => prev.filter(id => id !== fileId))}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Message input */}
            <Box sx={{ 
              p: 2, 
              bgcolor: 'background.paper',
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  size="small"
                />
                <input
                  type="file"
                  multiple
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <IconButton 
                  color="primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <AttachFileIcon />
                </IconButton>
                <IconButton 
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={(!message.trim() && fileIds.length === 0) || isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
                </IconButton>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Close</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default IssueChat; 