CREATE TABLE t_skyend_logger 
(
	m_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    m_source TEXT NOT NULL,
    m_level TEXT NOT NULL,
    m_message TEXT NOT NULL,
    m_stack TEXT NOT NULL,
    m_timestamp DATETIME NOT NULL
);