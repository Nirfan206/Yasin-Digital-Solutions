"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { MailOpen, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAllContactMessages, markContactMessageAsRead } from '../../api/contact'; // Re-using existing API functions
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import Modal from '../../components/Modal';
import { ContactMessage } from '../../types/api';

const AdminContactMessages = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [fetchingMessages, setFetchingMessages] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [loadingAction, setLoadingAction] = useState(false); // For marking as read

  useEffect(() => {
    const getMessages = async () => {
      if (!token) {
        setFetchingMessages(false);
        return;
      }
      setFetchingMessages(true);
      const { data, error } = await getAllContactMessages(token);
      if (data) {
        setMessages(data);
      } else if (error) {
        showError(error);
      }
      setFetchingMessages(false);
    };
    getMessages();
  }, [token]);

  const openMessageModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    if (!message.read) {
      handleMarkAsRead(message._id);
    }
  };

  const closeMessageModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  const handleMarkAsRead = async (messageId: string) => {
    if (!token) {
      showError('You must be logged in to mark messages as read.');
      return;
    }
    setLoadingAction(true);
    try {
      const { data, error } = await markContactMessageAsRead(token, messageId);
      if (data) {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg._id === messageId ? { ...msg, read: true } : msg
          )
        );
        showSuccess('Message marked as read.');
      } else if (error) {
        showError(error);
      }
    } catch (error) {
      showError('Failed to mark message as read.');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">Contact Messages</CardTitle>
      </CardHeader>
      <CardContent>
        {fetchingMessages ? (
          <p className="text-gray-600">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-600">No contact messages found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender Name</TableHead>
                  <TableHead>Sender Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message._id} className={!message.read ? 'bg-blue-50 hover:bg-blue-100' : ''}>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
                    <TableCell>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        message.read ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {message.read ? 'Read' : 'Unread'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(message.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openMessageModal(message)}
                        className="mr-2"
                      >
                        <Eye size={18} />
                      </Button>
                      {!message.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkAsRead(message._id)}
                          disabled={loadingAction}
                        >
                          <MailOpen size={18} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={closeMessageModal}
          title={selectedMessage ? `Message from ${selectedMessage.name}` : 'View Message'}
          description={selectedMessage?.subject}
          footer={
            <Button onClick={closeMessageModal}>Close</Button>
          }
        >
          {selectedMessage && (
            <div className="space-y-4 text-gray-700">
              <p><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
              <p><strong>Subject:</strong> {selectedMessage.subject}</p>
              <p><strong>Message:</strong></p>
              <p className="whitespace-pre-wrap border p-3 rounded-md bg-gray-50">{selectedMessage.message}</p>
              <p className="text-sm text-gray-500">Received on: {new Date(selectedMessage.createdAt).toLocaleString()}</p>
            </div>
          )}
        </Modal>
      </CardContent>
    </Card>
  );
};

export default AdminContactMessages;