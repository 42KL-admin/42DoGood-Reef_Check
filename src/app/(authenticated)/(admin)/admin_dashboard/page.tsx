'use client';

import EmailRowComponent from '@/components/EmailRowComponent';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useState, useEffect } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { Collapse } from '@mui/material';
import { useEmailRowStore } from '@/stores/emailRowStore';
import { EmailRole, EmailRow } from '@/stores/types';
import { useRouter } from 'next/navigation';
import SortByPermission from '@/components/SortbyPermission';
import { getEmailList } from '@/services/dashboardApi';

export default function UploadEmailSection() {
  const { addRow, rows, clearRows } = useEmailRowStore();
  const [sortByRole, setSortByRole] = useState<EmailRole | null>(null);
  const handleSortByRole = (role: EmailRole | null) => {
    setSortByRole(role);
  };

  const router = useRouter();

  // Filter rows based on sortByRole
  const filteredRows = sortByRole
    ? rows.filter((row) => row.role === sortByRole)
    : rows;

  const fetchEmails = async () => {
    try {
      const response = await getEmailList();
      const { data: emailList }: { data: EmailRow[] } = response;

      // Clear the existing rows
      clearRows();

      emailList.forEach(({ email, role }) => {
        addRow(email, role);
      });
    } catch (error) {
      console.error('Error fetching emails:', error);
      router.push('/');
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [addRow, clearRows]);

  return (
    <Box pt={12}>
      <Container
        maxWidth="xl"
        disableGutters
        sx={{ display: 'grid', borderTop: '1px black' }}
      >
        <Box
          display={'flex'}
          justifyContent="space-between"
          alignItems="center"
          style={{
            borderBottom: '1px solid #ccc',
            marginBottom: '0px',
            fontFamily: 'Roboto',
          }}
          sx={{
            mb: { xs: 50, md: 0 },
            padding: '8px 40px',
            pr: '94px',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          Email address
          <SortByPermission onSortByPermission={handleSortByRole} />
        </Box>
        <Box
          display="grid"
          rowGap={2.5}
          maxHeight={{ md: 500 }}
          sx={{ mb: { xs: 50, md: 0 } }}
        >
          <TransitionGroup>
            {filteredRows.map((row, index) => (
              <Collapse key={row.email}>
                <EmailRowComponent index={index} row={row} email={row.email} />
              </Collapse>
            ))}
          </TransitionGroup>
        </Box>
      </Container>
    </Box>
  );
}
